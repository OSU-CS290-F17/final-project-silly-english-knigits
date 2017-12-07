function getUser(userId){
	console.log("Getting user");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		console.log("Ready state changed: " + JSON.stringify(this));
		if(this.readyState == 4 && this.status == 200){
			var o = JSON.parse(this.response);
			console.log(this.response);

			document.getElementById("fname").value = o.Name;
			document.getElementById("fpic").value = o.PhotoURL;
			document.getElementById("fmail").value = o.Email;
			document.getElementById("fphone").value = "";
			document.getElementById("fpos").value = o.Position;
			document.getElementById("fdep").value = o.Department;
			document.getElementById("floc").value = o.Location;
			document.getElementById("fsal").value = o.Salary;
			showModal();
		}
	};
	xhttp.open("GET", "/person/"+userId, true);
	xhttp.send();
}

function createUser(userObj){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			clearForm();
			hideModal();
			forceReload();
		}
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
	stringy+= "position=" + userObj.position + "&";
	stringy+= "photourl=" + userObj.pic + "&";
	stringy+= "salary=" + userObj.sal + "&";
	stringy+= "phone=" + userObj.phone; + "&";
	stringy+= "department=" + userObj.dep;
	return stringy;

}

function showModal(){
	var modal = document.getElementById("myModal").style.display = "block";	
}

function hideModal(){
	console.log("Hiding");
	var modal = document.getElementById("myModal").style.display = "none";	
	clearForm();
}

function forceReload(){
	location.reload(true);
}

function showedit(id){
	//alert("Editing user " + id);
	getUser(id);
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
function clearForm(){
	document.getElementById("fname").value = "";
	document.getElementById("fpic").value = "";
	document.getElementById("fmail").value = "";
	document.getElementById("fphone").value = "";
	document.getElementById("fpos").value = "";
	document.getElementById("fdep").value = "";
	document.getElementById("floc").value = "";
	document.getElementById("fsal").value = "";

}

function processForm(){
	var name = document.getElementById("fname").value;	
	var pic = document.getElementById("fpic").value;	
	var mail = document.getElementById("fmail").value;	
	var phone = document.getElementById("fphone").value;	
	var pos = document.getElementById("fpos").value;	
	var dep = document.getElementById("fdep").value;	
	var loc = document.getElementById("floc").value;	
	var sal = document.getElementById("fsal").value;	

	if(name == "" || pic == "" || mail == "" || phone == "" || pos == "" || dep == "" || loc == "" || sal == ""){
		alert("All fields are required!");
	}
	else{
		if(sal < 2147483647){
		var obj = new Object();
		obj.name= name;
		obj.email = mail;
		obj.location = loc;
		obj.position = pos;
		obj.phone = phone;
		obj.sal = sal;
		obj.pic = pic;		
		obj.dep = dep;
		createUser(obj);
		console.log(JSON.stringify(obj));
		}
		else alert("Salary is too big!");
	}
}
