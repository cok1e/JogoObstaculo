let  canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3, velocidade = 12, estadoAtual,

   estados = {
    jogar: 0,   //mostra quantas vezes perdeu,se ganhou ou se está jogando
    jogando: 1,
    perdeu:2,
  },

   chao = {
    y: 550,
    altura:50,  //código do chão
    cor: "#e8da78",

    desenha(){
      ctx.fillStyle = this.cor
      ctx.fillRect( 0, this.y, LARGURA, this.altura ) //design do jogo
    },
  },

   bloco = {
    x: 50,
    y: 0,
    altura:50,
    largura:50,
    cor: "#ff9239",   //código do personagem jogado
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo:23.6 ,
    qntPulos: 0,
    score: 0,

    atualiza(){
      this.velocidade += this.gravidade
      this.y += this.velocidade

      if( this.y > chao.y - this.altura && estadoAtual != estados.perdeu  ){    //código de atualização quando perde ou atualiza
                this.y = chao.y - this.altura 
        this.qntPulos =  0    
        this.velocidade = 0
      }
    },

    pula(){
      if(this.qntPulos < maxPulos){   //código de função pular
        this.velocidade = -this.forcaDoPulo
        this.qntPulos++
      }
    },

    reset(){
      this.velocidade = 0
      this.y  = 0   //código para função resetar
      this.scorre = 0
    },

    desenha(){
      ctx.fillStyle = this.cor
      ctx.fillRect( this.x, this.y, this.altura, this.largura )  //código de desenho
    },
  },

 obstaculos = {
  _obs: [],
  cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff4d"], //código da função dos obstaculos
  tempoInsere: 0,

  insere() {
    this._obs.push({
      x: LARGURA,
      largura: 50,
      altura: 30 + Math.floor(120 * Math.random()), 
      cor: this.cores[Math.floor(5 * Math.random())], 
    })
    this.tempoInsere = 30 + Math.floor(22 * Math.random())
  },

  atualiza() {
    if(this.tempoInsere ==  0)   //código de atualização
      this.insere()
    else
      this.tempoInsere--

    for(let i = 0, tam = this._obs.length; i < tam; i++){
      let obs = this._obs[i]
      obs.x -= velocidade

      if( bloco.x < obs.x + obs.largura &&
        bloco.x + bloco.largura >= obs.x &&
        bloco.y + bloco.altura >= chao.y - obs.altura)
        estadoAtual = estados.perdeu

      else if(obs.x == 0)
        bloco.score++

      else if(obs.x <= -obs.largura){
        this._obs.splice(i, 1)
        tam--
        i--
      }
    }
  },

  limpa(){
    this._obs = []
  },

  desenha() {
    for(let i = 0, tam = this._obs.length; i < tam; i++) {
      let obs = this._obs[i]
      ctx.fillStyle = obs.cor
      ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura) //desenho
    }
  },
}

function clique(){
  if(estadoAtual == estados.jogando)
    bloco.pula()

  else if(estadoAtual == estados.jogar)
    estadoAtual = estados.jogando

  else if(estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){ //função de clicar
    estadoAtual = estados.jogar
    obstaculos.limpa()
    bloco.reset()
  }
}

function roda(){

  atualiza()
  desenha()

  window.requestAnimationFrame(roda) //código para rodar a animação
}

function atualiza(){
  frames++
  bloco.atualiza()
  if ( estadoAtual == estados.jogando) //código para função de atualizar
    obstaculos.atualiza()
}

function desenha() {
  ctx.fillStyle = "#80daff"
  ctx.fillRect(0, 0, LARGURA, ALTURA) //código para funcionar o desenho

  ctx.fillStyle = "#fff"
  ctx.font = "50px Arial"
  ctx.fillText( bloco.score, 30, 68 )


  switch (estadoAtual){

    case estados.jogar:
      ctx.fillStyle = "green"
      ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)// código do botão quando começa
      break
    case estados.perdeu:
      ctx.fillStyle = "red"
      ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)  //mostra o botão quando perde

      ctx.save()
      ctx.translate(LARGURA / 2, ALTURA / 2)
      ctx.fillStyle = "#fff"

      if(bloco.score < 10)
        ctx.fillText(bloco.score, -13, 19)
      else if(bloco.score >= 10 && bloco.score < 100) 
        ctx.fillText(bloco.score, -26, 19)
      else
        ctx.fillText(bloco.score, -39, 19)

      ctx.restore()
      break
    case estados.jogando:
      obstaculos.desenha()
      break
  }

  chao.desenha()
  bloco.desenha()
}

function main() {
    ALTURA  = window.innerHeight
    LARGURA = window.innerWidth

    if(LARGURA >= 500){
        LARGURA = 600;
        ALTURA = 600;
    }

    canvas = document.createElement("canvas")  //é o local de início (entry point) da execução de um programa
    canvas.width = LARGURA
    canvas.height = ALTURA
    canvas.style.border = "1px solid #000"

    ctx = canvas.getContext("2d")
    document.body.appendChild(canvas)
    document.addEventListener("mousedown", clique)

    estadoAtual = estados.jogar
    roda()
}
main()
