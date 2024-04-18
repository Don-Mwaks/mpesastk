document.addEventListener("DOMContentLoaded", function(){
    

    var button = document.getElementById("submit");
    
    button.addEventListener("click", function(){
        axios.get('http://127.0.0.1:3000/')
        .then(response =>{
            console.log(response.data);
            
        })
        .catch(error =>{
            console.error('Error:', error);
        });

       
    });

});
    





  