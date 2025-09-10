import React, { useRef, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Component, ScriptPage, DragItem, ComponentConfig } from '../../types';
import { ViewState } from '../../pages/ScriptEditor';
import { ComponentRenderer } from './ComponentRenderer';
import { snapToGrid, validateComponentPosition } from '../../utils/helpers';
import { Plus } from 'lucide-react';

interface CanvasProps {
  components: Component[];
  allComponents: Component[];
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  onUpdateComponentPosition: (id: string, newPosition: { x: number; y: number }) => void;
  onRemoveComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onAddComponent: (type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }, parentId?: string) => string;
  currentPage?: ScriptPage;
  onUpdatePage: (updates: Partial<ScriptPage>) => void;
  inlineEditingId: string | null;
  setInlineEditingId: (id: string | null) => void;
  theme: 'light' | 'dark';
  viewState: ViewState;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
}

// Taille logique du canevas, les composants sont contraints à l'intérieur.
export const CANVAS_WIDTH = 4000;
export const CANVAS_HEIGHT = 3000;

export const Canvas: React.FC<CanvasProps> = (props) => {
  const { components, onAddComponent, theme, viewState, setViewState } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);

  // --- Gestionnaires d'événements pour le zoom et le déplacement ---
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) { // Zoom
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const worldX = (mouseX - viewState.x) / viewState.scale;
        const worldY = (mouseY - viewState.y) / viewState.scale;
        const delta = e.deltaY * -0.001;
        const newScale = Math.max(0.1, Math.min(viewState.scale * (1 + delta), 4));
        const newX = mouseX - worldX * newScale;
        const newY = mouseY - worldY * newScale;
        setViewState({ scale: newScale, x: newX, y: newY });
      } else { // Déplacement (Pan)
        setViewState(vs => ({ ...vs, x: vs.x - e.deltaX, y: vs.y - e.deltaY }));
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsPanning(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      viewport.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [viewState, setViewState, isPanning]);
  
  // --- Logique du glisser-déposer ---
  const [, drop] = useDrop(() => ({
    accept: 'new-component',
    drop: (item: DragItem, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const viewportRect = viewportRef.current?.getBoundingClientRect();
      if (!clientOffset || !viewportRect) return;
      
      const dropX_viewport = clientOffset.x - viewportRect.left;
      const dropY_viewport = clientOffset.y - viewportRect.top;

      // Convertir les coordonnées du viewport en coordonnées du "monde"
      const dropX_world = (dropX_viewport - viewState.x) / viewState.scale;
      const dropY_world = (dropY_viewport - viewState.y) / viewState.scale;

      if (item.componentType && item.config && item.size) {
        const validatedPosition = validateComponentPosition(
            { x: snapToGrid(dropX_world), y: snapToGrid(dropY_world) },
            item.size,
            { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }
        );
        onAddComponent(item.componentType, item.config, item.size, validatedPosition);
      }
    },
  }));
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Désélectionner si le clic se fait sur le viewport lui-même
    if (e.target === viewportRef.current) {
        props.onSelectComponent(null);
    }
  };

  const rootComponents = components.filter(c => !c.parentId);

  // --- Style dynamique pour l'arrière-plan quadrillé ---
  const backgroundStyle: React.CSSProperties = {
    '--bg-color': theme === 'dark' ? '#111827' : '#f8fafc',
    '--grid-color': theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    '--grid-space': `${20 * viewState.scale}px`,
    backgroundColor: 'var(--bg-color)',
    backgroundImage: `
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: `var(--grid-space) var(--grid-space)`,
    backgroundPosition: `${viewState.x % (20 * viewState.scale)}px ${viewState.y % (20 * viewState.scale)}px`,
    cursor: isPanning ? 'grabbing' : 'grab',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div
      ref={(node) => { viewportRef.current = node; drop(node); }}
      className="flex-1 overflow-hidden relative"
      style={backgroundStyle}
      onClick={handleCanvasClick}
    >
      {/* Conteneur du "monde" qui contient tous les composants et qui est transformé */}
      <div
        className="absolute top-0 left-0"
        style={{
          transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Affiche uniquement les composants racines, les enfants sont affichés récursivement */}
        {rootComponents.map(component => 
          <ComponentRenderer 
            key={component.id} 
            {...props} 
            component={component} 
            canvasSize={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            viewScale={viewState.scale}
          />
        )}
      </div>
      
      {/* Texte d'aide lorsque le canevas est vide */}
      {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center text-slate-400 dark:text-gray-vs-500">
            <div>
              <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-slate-300 dark:border-gray-vs-600 rounded-lg flex items-center justify-center"><Plus size={32} /></div>
              <p className="font-semibold">Commencez à créer</p>
              <p className="text-sm">Glissez des composants depuis la barre latérale.</p>
            </div>
          </div>
        )}
    </div>
  );
};

