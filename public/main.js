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
	console.log("Showing modal");
	var modal = document.getElementById("myModal").style.display = "block";	
	
}

function hideModal(){
	var modal = document.getElementById("myModal").style.display = "none";	
}

function forceReload(){
	location.reload(true);
}

function showedit(id){
	alert("Editing user " + id);
}


function deleteUser(id){
	var confirmDel = confirm("Are you sure you want to delete user " + id + "?");
	if(confirmDel == true){
		console.log("Deleting user " + id);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				forceReload();
			}
			else{
				if(this.status == 500) console.log("Some error");
			}
		}
		xhttp.open("POST", "/delete", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("did=" + id);
	}
	else console.log("Aborting delete");
}


function collectPosts(){
	var result  = [];
	var content = document.getElementsByClassName('employee');
	for(i =0; i < content.length; i++){ 
		result.push(content[i]);
	}
	return result;
}
/*Text Filter*/
function serch(input, arr){
	text = null;
	if(input.trim() != ""){
		input = input.toLowerCase().trim().split(" ");	
		for(var i=0; i < arr.length; i++){
			text = arr[i].textContent.toLowerCase().trim().split(" ");		
			for(var j=0; j < text.length; j++){
				if(input.includes(text[j])){
					break;
					
				}else if(j+1 == text.length && !input.includes(text[j]) ){
					removePost(arr,i);
				}
			}
		}
	}
}
