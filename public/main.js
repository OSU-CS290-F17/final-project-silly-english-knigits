function getUser(userId){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){

	};
	xhttp.open("GET", "/person/"+userId, true);
	xhttp.send();
}

function createUser(userObj){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){

	}
	xhttp.open("POST", "/create", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(breakUser(userObj));

}

function updateUser(userObj){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){

	}
	xhttp.open("POST", "/update", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(breakUser(userObj));


}


function breakUser(userObj){
	var stringy = "";
	stringy+= "name=" + userObj.name + "&";
	stringy+= "email=" + userObj.email + "&";
	stringy+= "location=" + userObj.location + "&";
	stringy+= "position=" + userObj.position;

	return stringy;

}

function showModal(){
	var modal = document.getElementById("myModal").classList.remove("hidden");	

}

function hideModal(){
	var modal = document.getElementById("myModal").classList.add("hidden");
}

function forceReload(){
	location.reload(true);
}
