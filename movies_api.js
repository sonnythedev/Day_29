const xhr=new XMLHttpRequest();

const iconsImg={
    'title':'movie_title.png',
    'director':'movie_director.png',
    'actors':'movie_actor.png',
    'revenue':'movie_revenue.jpg',
    'plot':'movie_plot.png'
}


function searchByTitle(movieTitle,movieYear=null){
  document.getElementById('movie_title').value=movieTitle;
  
    let fullUrl=apiUrl+'apikey='+apiKey+'&t='+movieTitle+'&y='+movieYear;
    console.log(fullUrl);
    //fetch returns Promise object in JavaScript
    fetch(fullUrl)
    .then( //handling success of the Promise object
      function(resp){
         //console.log(resp);
         return resp.json();
      }
    )
    .then( 
      function(jsonData){
        formatMovieData(jsonData);
        generateSuggestions(movieTitle);
         
      }
    )
    .catch( //handling error of the Promise object
       function(err){
         console.log(err);
       }
    );
    
    /*
    xhr.onreadystatechange=function(){
      if(this.readyState==4 && this.status==200){
        //console.log(xhr.responseText);
        //let myData=xhr.responseText;
        formatMovieData(xhr.responseText);
        generateSuggestions(movieTitle);
      }
      
    }
    xhr.open('GET',fullUrl,true);
    xhr.send();
    */
    
}

////This is the method that FIRES UP at first.
function searchMovie(){
   document.getElementById('errorSec').innerHTML="";
   document.getElementById('results').innerHTML="";

    let movieTitle=document.getElementById('movie_title').value;
    let movieYear=document.getElementById('movie_year').value;

    searchByTitle(movieTitle,movieYear);

}

function generateSuggestions(movieTitle){
    let fullUrl=apiUrl+'apikey='+apiKey+'&s='+movieTitle;
   
   console.log(fullUrl);
   //const xhr=new XMLHttpRequest();
   xhr.onreadystatechange=function(){
     if(this.readyState==4 && this.status==200){
       formatSuggestionsData(xhr.responseText);
     }
     
   }
   xhr.open('GET',fullUrl,true);
   xhr.send();
}



function formatActorDetails(data){
  data=JSON.parse(data);
  //console.log(data);
  //console.log(data.results[0]);
  let result=data.results[0];
  let htmlResp=`
     <img src="${actorProfilePath+result.profile_path}" /><br/>
     Name: ${result.name}`;
 
  //document.getElementById('actorDetails').innerHTML=htmlResp;
   
  $('#actorDetails').html(htmlResp);
  $('#actorDetails').slideDown('3000');

}

function getActorData(actorValue){
  console.log('get actor data');
  let fullUrl=actorUrl+'api_key='+actorApiKey+'&query='+actorValue;
  console.log(actorUrl);
  console.log('full actor url',fullUrl);
  
  //const xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4 && this.status==200){
      //formatMovieData(xhr.responseText);
      formatActorDetails(xhr.responseText)
    }
  }
  xhr.open('GET',fullUrl,true);
  xhr.send();
}

function formatActorsData(actorsData){
  //al pacino, michele pfifer, villain guy
   let arr=actorsData.split(',');
   //let output='';
   let fetchArr=[];
   arr.forEach(
      (actor)=>{
         actor=actor.trim();
         //output +=`<a onclick="getActorData('${item}')">${item}</a> `;
         let fullUrl=actorUrl+'api_key='+actorApiKey+'&query='+actor;
         fetchArr.push(fetch(fullUrl)); //fetch Arr will have array of fetch or promise object
      }
   );
   //return output;
   Promise.all(fetchArr)
   .then(
     function(resp){ //combined response from all the fetch request
       //console.log(resp);
       let htmlResp='';
        resp.forEach(
            (item)=>{
              item.json(
                 function(jsonData){
                   let actorJson=jsonData.results[0];
                   htmlResp+=`<div>
              <img src="${actorProfilePath+actorJson.profile_path}" /><br/>
              Name: ${actorJson.name}</div>`;
                 }
              );
              
              
            }
        );
        $('#actorDetails').html(htmlResp);
        $('#actorDetails').slideDown('3000');
     }
   )
   .catch(
     function(err){
       //console.log(err);
     }
   )
}

//localStorage.clear();

function addToMyFavList(title){
   if(localStorage.getItem('favList')){
       //favList already exists in localstorage
       //console.log(localStorage.getItem('favList'));
       let myFavList=JSON.parse(localStorage.getItem('favList'));
       if(!myFavList["my_list"].includes(title)){
        myFavList["my_list"].push(title);
       }
       
       localStorage.setItem('favList',JSON.stringify(myFavList));
       console.log(localStorage.getItem('favList'));
       
   }
   else{
     //favList doesn't exist in local storage
     let myFavList={};
     myFavList["my_list"]=[title];
     localStorage.setItem('favList',JSON.stringify(myFavList));
      console.log(localStorage.getItem('favList'));
    }

}
function deleteFav(item){
       let myFavList=JSON.parse(localStorage.getItem('favList'));
       if(myFavList["my_list"].includes(item)){
          myFavList["my_list"].splice(myFavList["my_list"].indexOf(item),1);
       }
       localStorage.setItem('favList',JSON.stringify(myFavList));
       showMyFavList();
}
//localStorage.clear();
function showMyFavList(){
  if(localStorage.getItem('favList')){
    let myFavList=JSON.parse(localStorage.getItem('favList'));
    let favOutput='<ul class="favList">';
    for(let item of myFavList["my_list"]){
      favOutput += `<li>${item} <img src="images/delete.png" onclick="deleteFav('${item}')"/></li>`;
    }
    favOutput +='</ul>';
    document.getElementById('modalContent').innerHTML=favOutput;
  }
  else{
    //console.log('show my fav empty list');
    document.getElementById('modalContent').innerHTML='You Dont Have Any Favorites!';
  }
  document.getElementById('modalHolder').style.display='block';

}
/*
/*
{"Response":"False","Error":"Movie not found!"}
*/
function formatMovieData(data){
     //data=JSON.parse(data);
      console.log(data);
     if(data.Response=="False"){
       document.getElementById("errorSec").innerHTML=data.Error;
     }
     //console.log(data);
     console.log(data.Actors);

     let htmlResp=`<div id="poster" class="poster"><img src="${data.Poster}"/></div>
     <div>
     <button onclick="addToMyFavList('${data.Title}')">Add to My Fav</button>
     <button onclick="showMyFavList()">Show My Fav List</button>
     </div>
     <ul class='ulMovieDetails'>
     <li><span class='icon'><img src="images/${iconsImg["title"]}"/></span> <span class='title'>${data.Title}</span></li>
     <li><span class='icon'>Year: </span>${data.Year}</li>
     <li><span class='icon'>Rated: </span>${data.Rated}</li>
     <li><span class='icon'><img src="images/${iconsImg["director"]}"/></span> ${data.Director}</li>
     <li><span class='icon'><img src="images/${iconsImg["actors"]}"/></span> ${formatActorsData(data.Actors)}</li>
     <li><div id="actorDetails" class="actorDetails"></div></li>
     <li><span class='icon'><img src="images/${iconsImg["revenue"]}"/></span> <span class="money">${data.BoxOffice}</span></li>
     <li><span class='icon'><img src="images/${iconsImg["plot"]}"/></span> ${data.Plot}</li>
     </ul>`;
     
     console.log(htmlResp);

     document.getElementById('results').innerHTML=htmlResp;

}

function formatSuggestionsData(data){
  data=JSON.parse(data);
  let htmlResp='Did you mean: ';
  data.Search.forEach(
    (item)=>{
      htmlResp +=`<a href='#' onclick="searchByTitle('${item.Title}')">${item.Title}</a>&nbsp;&nbsp;&nbsp;&nbsp;`;
    }
  );
  //console.log(htmlResp);
  document.getElementById('suggestions').innerHTML=htmlResp;
}

function closeModal(){
  document.getElementById('modalContent').innerHTML='';
  document.getElementById('modalHolder').style.display='none';
}

