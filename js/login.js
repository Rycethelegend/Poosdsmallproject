// const urlBase = 'http://COP4331-5.com/LAMPAPI';
// const urlBase = 'http://127.0.0.1:5500/LAMPAPI';
// const urlBase = 'http://161.35.14.108/LAMPAPI';

const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("regFirstName").value;
	let password = document.getElementById("regLastName").value;
//	var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
    
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function loadCookie()
{
	userId = -1;
	firstName = "";
	lastName = "";

	let splits = document.cookie.split(/[;,]/);
	for (let i = 0; i < splits.length; i++)
	{
		let tokens = splits[i].trim().split("=");

		if( tokens[0] == "firstName" )     { firstName = tokens[1]; }
		else if( tokens[0] == "lastName" ) { lastName = tokens[1]; }
		else if( tokens[0] == "userId" )   { userId = parseInt( tokens[1] ); }
	}

	if( isNaN(userId) ) { userId = -1; }

	return userId > 0;
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}


function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";

	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	document.cookie = "lastName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

	window.location.replace("index.html");
}

function requireLogin()
{
	if( !loadCookie() )
	{
		window.location.replace("index.html");
		return false;
	}

    // push the 20-minute expiry forward
	saveCookie();   
	return true;
}

function redirectIfLoggedIn()
{
	if( loadCookie() )
	{
		window.location.replace("contacts.html");
	}
}