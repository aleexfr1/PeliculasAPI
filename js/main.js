
var key="apikey=2facdd62";
var enlace="https://www.omdbapi.com/?";
var pagina=1;
var nombre,anio;
var bloqueo=false;

$(window).scroll(comprobarBloqueo);

//Cerrar modal
$('#cerrar').on('click',function(){
    $('#modalCenter').fadeOut();
    limpiarModal();
})

function mostrarPortadas(){
    $('#movies').empty();
    pagina=1;
    nombre=$('#name').val();
    anio=$('#year').val();
    anadirPortadas();
}

function comprobarBloqueo(){
    if(!bloqueo)
        anadirPortadas();
}

function anadirPortadas(){
    if(($(window).scrollTop() + $(window).height() >= $(document).height()-100)){
        $('#carga').attr("style",'');
        bloqueo=true;
        var peticion=enlace;
        nombreDividido=nombre.split(" ");
        peticion+="s=";
        for (let index = 0; index < nombreDividido.length; index++) {
            if(index==0&&nombreDividido.length>1)
                peticion+=nombreDividido[index]+"+";
            else if(index<nombreDividido.length-1)
                peticion+=nombreDividido[index]+"+";
            else
                peticion+=nombreDividido[index];
        }
        if(anio!="")
            peticion+="&y="+anio;
        peticion+="&page="+pagina+"&"+key;
        console.log(peticion);
        $.ajax({
            url: peticion,
            success: function(respuesta) {
                console.log(respuesta);
                maquetarPortadas(respuesta);
                $('#carga').attr("style",'display:none');
            },
            error: function() {
                console.log("No se ha podido obtener la información");
            }
        });
        pagina++;
    }
}

function maquetarPortadas(peliculas){
    console.log(peliculas)
    $.each(peliculas.Search,function(indice,element){

        var pelicula=$('<div>');
        pelicula.id=element.imdbID;
        $(pelicula).on("click",() =>buscarPelicula(pelicula.id));
        $(pelicula).attr('class','card col-12 col-sm-6 col-lg-3');

        var contenedorPortada=$("<div>");
        $(contenedorPortada).attr('id','imgPelicula');
        var portada=$('<img>');
        if(element.Poster!="N/A")
            $(portada).attr("src",element.Poster);
        else
            $(portada).attr("src",'./img/notFound.jpg');
        $(portada).attr("class","card-img-top");
        console.log($('portada'))

        var body=$("<div>");
        $(body).attr("class","card-img-overlay d-flex align-items-center justify-content-center tituloPelicula")
        $(body).mouseenter(function(){
            $(contenedorPortada).css({"opacity": "0.3","transition": "1s"})
        })
        $(body).mouseleave(function(){
            $(contenedorPortada).css({"opacity": "1","transition": "1s"})
        })

        var titulo=$("<h5>");
        $(titulo).attr("class","card-title");
        $(titulo).text(element.Title);
        $(contenedorPortada).append(portada);
        $(pelicula).append(contenedorPortada);
        $(body).append(titulo);
        $(pelicula).append(body);
        $('#movies').append(pelicula);
    });
    bloqueo=false;
}

function buscarPelicula(id){
    var peticion=enlace;
    peticion+='i='+id;
    peticion+="&"+key;
    $.ajax({
        url: peticion,
        success: function(respuesta) {
            console.log(respuesta);
            maquetarModal(respuesta);
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });
}

function limpiarModal(){
    $('i').attr('class','far fa-star')
    $('#genre').text("");
    $('#release').text("");
    $('#director').text("");
    $('#writer').text("");
    $('#actors').text("");
    $('#plot').text("");
    $('#rating').text("");
}
function ponerEstrellas(imdbRating){
    var rating=parseInt(imdbRating.split(".")[0]);
    let estrella = parseInt(rating/2);
    
    //Puntuacion media
    $('i:lt('+estrella+')').attr("class","fas fa-star");

    rating%2==1 ? $('i:eq('+(estrella)+')').attr("class","fas fa-star-half-alt"): null;
}

function maquetarModal(datos){
    $('#modalTitle').text(datos.Title);
    if(datos.Poster!="N/A")
        $('#img').attr("src",datos.Poster);
    else
        $('#img').attr("src",'./img/notFound.jpg');
    $('#genre').text(datos.Genre)
    $('#release').text(datos.Released)
    $('#director').text(datos.Director)
    $('#writer').text(datos.Writer)
    $('#actors').text(datos.Actors)
    $('#plot').text(datos.Plot)
    $('#numPuntuacion').text(datos.imdbRating);
    ponerEstrellas(datos.imdbRating);
    $('#modalCenter').fadeIn();
}
