import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface Palabra {
  termino: string;
  nivel: string;
  encontrada?: boolean;
}

interface Celda {
  letra: string;
  seleccionada: boolean;
  indice: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      transition: all 0.3s ease;
      font-family: 'Poppins', sans-serif;
    }
    
    .modo-oscuro {
      background-color: #1a1a1a;
      color: #ffffff;
    }
    
    .modo-oscuro .cell {
      background-color: #2d2d2d;
      border-color: #404040;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .modo-oscuro .cell:hover {
      background-color: #404040;
    }
    
    .modo-oscuro .nav-button {
      background-color: #2d2d2d;
      color: #ffffff;
    }
    
    .modo-oscuro .nav-button:hover {
      background-color: #404040;
    }
    
    .modo-oscuro .title {
      color: #60a5fa;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .title {
      text-align: center;
      color: #ffffff;
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .theme-toggle {
      padding: 0.75rem 1.5rem;
      border-radius: 2rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }
    
    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    
    .game-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(15, minmax(30px, 1fr));
      gap: 4px;
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .cell {
      aspect-ratio: 1;
      border: 2px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Roboto Mono', monospace;
      font-weight: 600;
      font-size: 1.2rem;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      border-radius: 8px;
      background-color: #f8fafc;
      color: #1e293b;
    }
    
    .cell.selected {
      background-color: #818cf8 !important;
      color: white;
      transform: scale(1.1);
      border-color: #6366f1;
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }
    
    .modo-oscuro .cell.selected {
      background-color: #818cf8 !important;
      border-color: #6366f1;
    }
    
    .cell:hover {
      background-color: #f1f5f9;
      transform: scale(1.05);
    }
    
    .navigation {
      display: flex;
      gap: 0.75rem;
      margin: 1.5rem 0;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .nav-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 1rem;
      cursor: pointer;
      background-color: #f1f5f9;
      color: #1e293b;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 1rem;
    }
    
    .nav-button:hover {
      background-color: #e2e8f0;
      transform: translateY(-2px);
    }
    
    .nav-button.active {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);
    }
    
    .modo-oscuro .nav-button.active {
      background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
    }
    
    .word-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 0.75rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      align-content: start;
    }
    
    .word-item {
      padding: 0.75rem;
      border-radius: 0.75rem;
      background-color: #f1f5f9;
      color: #1e293b;
      font-weight: 500;
      text-align: center;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }
    
    .modo-oscuro .word-item {
      background-color: #2d2d2d;
      color: #e5e7eb;
    }
    
    .word-item.found {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      transform: scale(1.05);
      box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
    }
    
    .modo-oscuro .word-item.found {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }
    
    @media (max-width: 768px) {
      .game-container {
        grid-template-columns: 1fr;
      }
      
      .grid {
        grid-template-columns: repeat(15, minmax(20px, 1fr));
        gap: 2px;
        padding: 1rem;
      }
      
      .cell {
        font-size: 1rem;
      }
      
      .title {
        font-size: 1.8rem;
      }
      
      .container {
        padding: 1rem;
      }
    }
  `],
  template: `
    <div [class.modo-oscuro]="modoOscuro">
      <div class="container">
        <div class="header">
          <h1 class="title">Sopa de Letras Angular</h1>
          <button class="theme-toggle" (click)="toggleTema()">
            {{ modoOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro' }}
          </button>
        </div>

        <div class="navigation">
          <button 
            *ngFor="let nivel of niveles" 
            class="nav-button" 
            [class.active]="nivelActual === nivel"
            (click)="cambiarNivel(nivel)"
          >
            {{nivel}}
          </button>
        </div>

        <div class="game-container">
          <div class="grid">
            <div
              *ngFor="let celda of celdas"
              class="cell"
              [class.selected]="celda.seleccionada"
              (click)="toggleSeleccion(celda)"
            >
              {{celda.letra}}
            </div>
          </div>

          <div class="word-list">
            <div 
              *ngFor="let palabra of palabrasFiltradas" 
              class="word-item"
              [class.found]="palabra.encontrada"
            >
              {{palabra.termino}}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class App {
  modoOscuro = false;
  nivelActual = 'Básico';
  niveles = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];
  celdasSeleccionadas: Set<number> = new Set();

  palabras: Palabra[] = [
    // Básico (5 palabras)
    { termino: 'ANGULAR', nivel: 'Básico' },
    { termino: 'HTML', nivel: 'Básico' },
    { termino: 'CSS', nivel: 'Básico' },
    { termino: 'DOM', nivel: 'Básico' },
    { termino: 'API', nivel: 'Básico' },
    
    // Intermedio (8 palabras)
    { termino: 'COMPONENTE', nivel: 'Intermedio' },
    { termino: 'SERVICIO', nivel: 'Intermedio' },
    { termino: 'MODULO', nivel: 'Intermedio' },
    { termino: 'DIRECTIVA', nivel: 'Intermedio' },
    { termino: 'TUBERIA', nivel: 'Intermedio' },
    { termino: 'RXJS', nivel: 'Intermedio' },
    { termino: 'ROUTER', nivel: 'Intermedio' },
    { termino: 'FORMS', nivel: 'Intermedio' },
    
    // Avanzado (12 palabras)
    { termino: 'OBSERVABLE', nivel: 'Avanzado' },
    { termino: 'DEPENDENCIA', nivel: 'Avanzado' },
    { termino: 'INYECCION', nivel: 'Avanzado' },
    { termino: 'CICLOVIDA', nivel: 'Avanzado' },
    { termino: 'PROMESA', nivel: 'Avanzado' },
    { termino: 'TYPESCRIPT', nivel: 'Avanzado' },
    { termino: 'INTERFACE', nivel: 'Avanzado' },
    { termino: 'DECORATOR', nivel: 'Avanzado' },
    { termino: 'TEMPLATE', nivel: 'Avanzado' },
    { termino: 'BINDING', nivel: 'Avanzado' },
    { termino: 'SUBJECT', nivel: 'Avanzado' },
    { termino: 'GUARD', nivel: 'Avanzado' },
    
    // Experto (15 palabras)
    { termino: 'RESOLVER', nivel: 'Experto' },
    { termino: 'INTERCEPTOR', nivel: 'Experto' },
    { termino: 'MIDDLEWARE', nivel: 'Experto' },
    { termino: 'WEBSOCKET', nivel: 'Experto' },
    { termino: 'LAZY', nivel: 'Experto' },
    { termino: 'PRELOAD', nivel: 'Experto' },
    { termino: 'SINGLETON', nivel: 'Experto' },
    { termino: 'PROVIDER', nivel: 'Experto' },
    { termino: 'METADATA', nivel: 'Experto' },
    { termino: 'COMPILER', nivel: 'Experto' },
    { termino: 'PLATFORM', nivel: 'Experto' },
    { termino: 'RENDERER', nivel: 'Experto' },
    { termino: 'ZONE', nivel: 'Experto' },
    { termino: 'BUNDLE', nivel: 'Experto' },
    { termino: 'AOT', nivel: 'Experto' }
  ];

  letrasGrid: string[] = [];
  celdas: Celda[] = [];

  constructor() {
    this.generarNuevaGrilla();
  }

  get palabrasFiltradas(): Palabra[] {
    return this.palabras.filter(p => p.nivel === this.nivelActual);
  }

  toggleTema() {
    this.modoOscuro = !this.modoOscuro;
  }

  cambiarNivel(nivel: string) {
    this.nivelActual = nivel;
    this.generarNuevaGrilla();
    this.resetearPalabras();
  }

  resetearPalabras() {
    this.palabras.forEach(p => p.encontrada = false);
  }

  generarNuevaGrilla() {
    const size = 15;
    const grid = Array(size * size).fill('');
    const palabrasNivel = this.palabras.filter(p => p.nivel === this.nivelActual);
    
    for (const palabra of palabrasNivel) {
      let colocada = false;
      let intentos = 0;
      const maxIntentos = 100;
      
      while (!colocada && intentos < maxIntentos) {
        const direccion = Math.floor(Math.random() * 8);
        const [dx, dy] = this.obtenerDireccion(direccion);
        const pos = this.encontrarPosicionValida(grid, palabra.termino, size, dx, dy);
        
        if (pos !== null) {
          this.colocarPalabra(grid, palabra.termino, pos, size, dx, dy);
          colocada = true;
        }
        
        intentos++;
      }
    }
    
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] === '') {
        grid[i] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
    
    this.letrasGrid = grid;
    this.celdas = this.letrasGrid.map((letra, indice) => ({
      letra,
      seleccionada: false,
      indice
    }));
  }

  obtenerDireccion(dir: number): [number, number] {
    const direcciones: [number, number][] = [
      [1, 0],   // derecha
      [0, 1],   // abajo
      [1, 1],   // diagonal derecha abajo
      [-1, 1],  // diagonal izquierda abajo
      [-1, 0],  // izquierda
      [0, -1],  // arriba
      [-1, -1], // diagonal izquierda arriba
      [1, -1]   // diagonal derecha arriba
    ];
    return direcciones[dir];
  }

  encontrarPosicionValida(grid: string[], palabra: string, size: number, dx: number, dy: number): number | null {
    const len = palabra.length;
    const posicionesValidas = [];
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let valido = true;
        
        for (let i = 0; i < len; i++) {
          const newX = x + dx * i;
          const newY = y + dy * i;
          
          if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
            valido = false;
            break;
          }
          
          const pos = newY * size + newX;
          if (grid[pos] !== '' && grid[pos] !== palabra[i]) {
            valido = false;
            break;
          }
        }
        
        if (valido) {
          posicionesValidas.push(y * size + x);
        }
      }
    }
    
    if (posicionesValidas.length === 0) return null;
    return posicionesValidas[Math.floor(Math.random() * posicionesValidas.length)];
  }

  colocarPalabra(grid: string[], palabra: string, pos: number, size: number, dx: number, dy: number) {
    const len = palabra.length;
    const x = pos % size;
    const y = Math.floor(pos / size);
    
    for (let i = 0; i < len; i++) {
      const newX = x + dx * i;
      const newY = y + dy * i;
      grid[newY * size + newX] = palabra[i];
    }
  }

  toggleSeleccion(celda: Celda) {
    celda.seleccionada = !celda.seleccionada;
    
    if (celda.seleccionada) {
      this.celdasSeleccionadas.add(celda.indice);
    } else {
      this.celdasSeleccionadas.delete(celda.indice);
    }
    
    this.verificarPalabra();
  }

  verificarPalabra() {
    const indices = Array.from(this.celdasSeleccionadas).sort((a, b) => a - b);
    const palabra = indices.map(i => this.celdas[i].letra).join('');
    
    const palabraEncontrada = this.palabrasFiltradas.find(
      p => p.termino === palabra && !p.encontrada
    );
    
    if (palabraEncontrada) {
      palabraEncontrada.encontrada = true;
      this.celdasSeleccionadas.clear();
      this.celdas.forEach(celda => celda.seleccionada = false);
    }
  }
}

bootstrapApplication(App);