const userWeather=document.querySelector("[data-userWeather]");
const searchWeather=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const apiKey="e49a65f13d016d7873f8976bcce408c2";
const error = document.querySelector(".error");

let currTab=userWeather;
currTab.classList.add("current-tab");

getFromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!=currTab){
        currTab.classList.remove("current-tab");
        currTab=clickedTab;
        currTab.classList.add("current-tab");
    
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromSessionStorage();
    }
}
}

userWeather.addEventListener("click",()=>{
    switchTab(userWeather);
})

searchWeather.addEventListener("click",()=>{
    switchTab(searchWeather);
})

function getFromSessionStorage(){
    let localCordinates=sessionStorage.getItem("user-cordinates");
    if(!localCordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const cordinates=JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinates);
    }
}

async function fetchUserWeatherInfo(cordinates){
    let {lat,lon}=cordinates;
    grantAccessContainer.classList.remove("active");
    error.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        let data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        
        renderweatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        error.classList.add("active");
    }
}


function renderweatherInfo(data){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const weatherDesc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-Humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText=data?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText=`${data?.main?.temp} °C`;
    windSpeed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity} %`;
    cloudiness.innerText=`${data?.clouds?.all} %`;

}

const grantAccessBtn=document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getLocation);


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    }
  }
  
  function showPosition(position) {
   const userLocation = {
     lat:  position.coords.latitude,
     lon:  position.coords.longitude,
    }

    sessionStorage.setItem("user-cordinates",JSON.stringify(userLocation)); 
  }

const searchInput=document.querySelector("[data-searchInput]");   
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let city=searchInput.value;
    if(city==="") return;
    else{
        fetchSearchWeatherInfo(city);
    }
});

async function fetchSearchWeatherInfo(city){
    
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    error.classList.remove("active");
    loadingScreen.classList.add("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
          );
          if(!response.ok){
            throw new error('Network not found');
          }
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        
        renderweatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        error.classList.add("active");
    }
}

