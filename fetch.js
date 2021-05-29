// Declaração de variaveis a serem utilizada
let btnAvancar = document.querySelector("#btnNext");
let btnVoltar = document.querySelector("#btnPreview");
let btnsearch = document.querySelector("#btnSearch");
let list = document.querySelector("#sel1");
let divArtwork = document.querySelector("#official_artwork");
let contSprite = document.querySelector("#sprite-photo");
let progress = document.querySelector("#progress");
let page = 0;
let sprites = [];
// Função para retorno de lista de Pokemons a serem mostradas no Select 
function getPokemons(page){
    fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=${page == 140 ? 11 : 20}`)
        .then(response => response.json())
        .then(data => {
            list.innerHTML=''
            list.appendChild(document.createElement("option"))
            data.results.map((pokemon) =>{
                let opt = document.createElement("option");
                opt.textContent=pokemon.name;
                list.appendChild(opt);
            })
        })
        .catch(console.error)
}
// Função para retorno de dados de um Pokemon Escolhido 
function getPokemonStats(pokemon){
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(response => response.json())
    .then(data =>{
        sprites = getSprites(data.sprites);
        contSprite.innerHTML ='';
        let h3 = document.createElement("h3");
        h3.textContent = "#" + data.id + " " +data.name.toUpperCase();
        contSprite.appendChild(h3);
        sprites.filter((e)=> e != null).map(sprite=>{
            let img = document.createElement("img");
            img.src = sprite;
            img.alt = `imagem do pokemon ${data.name}`
            contSprite.appendChild(img)
        })
        stats = getStats(data.stats);
        progressBars = mountProgressBars(stats);
        progress.innerHTML="";
        progressBars.map(e=>{
            let prog = document.createElement("div");
            prog.classList.add("progress");
            prog.appendChild(e);
            progress.appendChild(prog);
        })
        let img = document.createElement("img");
        img.classList.add("artwork");
        img.src=data.sprites.other["official-artwork"].front_default;
        divArtwork.innerHTML="";
        divArtwork.appendChild(img);
    })
    .catch(()=>{alert("pokemon invalido")})
}
// Funcao para atribuicao de sprites 
function getSprites(spriteslist){
    let list = [];
    list.push(spriteslist.back_default);
    list.push(spriteslist.back_female);
    list.push(spriteslist.back_shiny);
    list.push(spriteslist.back_shiny_female);
    list.push(spriteslist.front_default);
    list.push(spriteslist.front_female);
    list.push(spriteslist.front_shiny);
    list.push(spriteslist.front_shiny_female);
    return list;
}
// Funcao para atribuicao de Status 
function getStats(status){
    let pokeStatus={
        hp:status[0].base_stat,
        attack:status[1].base_stat,
        defense:status[2].base_stat,
        special_attack:status[3].base_stat,
        special_defense:status[4].base_stat,
        speed:status[5].base_stat
    }
    return pokeStatus;
}
// Montagem da Barra de status 
function mountProgressBars(status){
    barList = [];
    for (a in status){
        bar = document.createElement("div");
        if(a=="hp")
            bar.classList.add("progress-bar-striped", "bg-success");
        else if(a=="attack")
            bar.classList.add("progress-bar-striped", "bg-danger");
        else if(a=="defense")
            bar.classList.add("progress-bar-striped", "bg-warning");
        else
            bar.classList.add("progress-bar-striped", "bg-info"); 
        bar.textContent=`Base  ${a}:` + status[a];
        bar.style=`width: ${status[a]}%`;
        barList.push(bar);
    }   
    return barList;
}
// Event Listenners 
btnAvancar.addEventListener("click", ()=>{
    if(page <=120){
        page += 20;
        getPokemons(page);
    }else{alert("25 Iniciais")}
})
btnVoltar.addEventListener("click", ()=>{
    if(page >= 20){
        page -= 20;
        getPokemons(page);
    }else{
        alert("20 Iniciais")
    }
})
list.addEventListener("change", (e)=>{
    if(e.target)
        getPokemonStats(e.target.value);
})
btnsearch.addEventListener("click", (e)=>{
    e.preventDefault();
    let input = document.querySelector("#inputSearch");
    getPokemonStats(input.value.toLowerCase());
})
getPokemons(page);