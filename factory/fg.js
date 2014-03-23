'use strict'

module.exports = function($q, $http)
{
	//Upload/Create File -> Provision then Upload
	//Create Folder with or without parent
	//Add a User
	//Add a User Profile with or without a user group

	//Join -> Add User Profile, Add User Group, Add User to Group
	//New Donation -> Add Donation Folder "Org - Tracking#" to Pending, Update Folder ACL to group
	//Add Item  -> Upload Image to Donation Folder
	//Signin -> Remember Username & Password

	var adminAuth = {"fg-domain":"ocrx"}
	  , url = 'https://secure.foldergrid.com/'

	var prompt = require('readline').createInterface(process.stdin, process.stdout)

	prompt.question('Admin username ', function(username)
	{
		prompt.question('Admin password ', function(password)
		{
			adminAuth['fg-username'] = username
			adminAuth['fg-password'] = password

			console.log('\nThank you! Exit to daemon with ctrl-c')

			prompt.close()
		})
	})

	return {

		saveFile: function(folder, name, data)
		{
			var dataURL = '^data:.+\/(.+?);(.+?)$'

			//RexEx and split have trouble on large files, so split apart manually
			var index = data.indexOf(',')

			data = [data.slice(0, index), data.slice(index)]

			data[0] = data[0].match(RegExp(dataURL))

			if ( ! data[0])
			{
				return $q.reject
				({
					status:415,
					data:'fg expects file data as a dataURL that matches the regex '+dataURL
				})
			}

			data = new Buffer(data[1], data[0][2])

			var md5 = require('crypto').createHash('md5').update(data).digest('hex')

			return $http.put
			(
				url+'file/provision',
				{
					"name": name,
					"parentDuid": folder,
					"source-updated": Date.now(),
					"source-created": Date.now(),
					"md5":md5
				},
				{ headers:adminAuth }
			)

			.catch(function(res)
			{
				if (302 != res.status)
				{
					return $q.reject(res)
				}

				var headers = ng.extend
				({
					'fg-md5': md5,
					'fg-eap': false,
					'content-type': 'binary/octet-stream'
				}, adminAuth)

				return $http.put
				(
					res.headers('location'),
					data,
					{headers:headers}
				)
			})
		},

		saveFolder: function(uuid, name)
		{
			var parentDuid =  "10f2236f-46e3-48a1-b3ae-ff10866eeb47" //Pending Folder

			var q         = $q.defer()
			  , saveFile  = this.saveFile

			//Foldergrid's watch email is not triggered on a subfolder creation
			//or on a file "copied" into the folder.  So we either implement our
			//own emails or we create a new csv file to trigger watch to send email
			//also watch cannot be set for other users, so we can't just set the
			//ocrVendor to watch this new folder without their credentials
			require('fs').readFile('assets/output.csv', function(err, file)
			{
				if (err) q.reject(err)

				file = 'data:text/csv;base64,'+file.toString('base64')

				q.resolve(saveFile(parentDuid, name+'.csv', file))
			})

			var saveFolder = $http.put
			(
				url+'folder/'+uuid,
				{
					name: name,
					parentDuid: parentDuid,
					subfoldersInherit: true
				},
				{headers:adminAuth}
			)

			return $q.all([q.promise, saveFolder])
		},

		saveUser: function(user)
		{
			return $http.put
			(
				url+'user/'+user.email,
				{
					password : user.password,
					firstname: user.name,
					//No way to query group(s) for a user, so we hackily store the group name as the user's lastname
					lastname : user.group,
					expirePassword: false,
					suppressWelcomeEmail: true,
					enabled: true
				},
				{headers:adminAuth}
			)

			.then(function()
			{
				return $http.put
				(
					url+'group/'+user.group+'/'+user.email,
					{},
					{headers:adminAuth}
				)
			})
		},

		login:function(user)
		{
			//Check if user exists and get their group (stored as their lastname)
			var profile = $http.get
			(
				url+'user/'+user.email,
				{headers:adminAuth}
			)

			.then(function(res)
			{
				if ('null' == res.data)
				{
					return $q.reject
					({
						status:401,
						data:'Email does not exist'
					})
				}

				user.name  = res.data.firstname
				user.group = res.data.lastname
			})

			//Try to login with the user's name and password
			var login = $http.post
			(
				url+'login','domain=ocrx&username='+user.email+'&password='+user.password,
				{
					headers:
					{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}
			)

			//Returns 302 on success or failure
			.catch(function(res)
			{
				//Error occurred
				if (302 != res.status)
				{
					return $q.reject(res)
				}

				//Login was successful return group name and auth token
				if ( ! ~ res.headers('set-cookie')[0].indexOf('userid'))
				{
					return $q.reject
					({
						status:401,
						data:'Incorrect password'
					})
				}

				user.auth = res.headers('set-cookie')[0].slice(13)
			})

			//Execute these requests in parallel
			return $q.all([profile, login]).then(function()
			{
				return user
			})
		},

		listGroups:function()
		{
			//FG documentation forgot to add the trailing slash!
			return $http.get(url+'group/', {headers:adminAuth})

			.then(function(groups)
			{
				return groups.data.slice(2).map(function(group)
				{
					return group.name
				})
			})
		}
	}
}