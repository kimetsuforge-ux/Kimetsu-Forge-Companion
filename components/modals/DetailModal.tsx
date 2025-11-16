import React from 'react';
import { Modal } from '../ui/Modal';
import { useCoreUI } from '../../contexts/AppContext';
import { Button } from '../ui/Button';

// Helper component for structured sections
const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-md font-semibold text-accent-end mb-2 border-b border-border-color pb-1">{title}</h4>
        {children}
    </div>
);

// Helper to parse strings with list-like structures
const renderTextWithLists = (text: string) => {
    // Split by newlines that are preceded by another newline to get paragraphs
    const paragraphs = text.split(/\n(?=\n)/);
    
    return paragraphs.map((paragraph, pIndex) => {
        // Check if a paragraph contains list items (e.g., starting with '-')
        if (paragraph.includes('\n- ')) {
            const lines = paragraph.split('\n');
            const listItems = lines.filter(line => line.trim().startsWith('-'));
            const introText = lines.slice(0, lines.findIndex(line => line.trim().startsWith('-'))).join('\n');
            
            return (
                <div key={pIndex}>
                    {introText && <p className="mb-2">{introText}</p>}
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        {listItems.map((item, lIndex) => (
                            <li key={lIndex}>{item.trim().substring(1).trim()}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        return <p key={pIndex} className="whitespace-pre-wrap leading-relaxed">{paragraph.trim()}</p>;
    });
};


export const DetailModal: React.FC = () => {
  const { isDetailModalOpen, closeDetailModal, selectedItem } = useCoreUI();

  const getTitle = () => {
    if (!selectedItem) return "Detalhes";
    return selectedItem.name || selectedItem.title || "Detalhes do Item";
  };
  
  const renderContent = () => {
      if (!selectedItem) {
          return (
              <div className="p-4 bg-bg-primary border border-border-color rounded-md flex-grow flex items-center justify-center">
                <p className="text-text-muted italic">Nenhum item selecionado...</p>
              </div>
          );
      }
      
      // GuerraDeClasItem
      if ('keyEvents' in selectedItem && 'outcome' in selectedItem) {
          return (
              <div className="space-y-4">
                  <DetailSection title="Sinopse">{renderTextWithLists(selectedItem.synopsis)}</DetailSection>
                  <DetailSection title="Eventos Chave">{renderTextWithLists(selectedItem.keyEvents)}</DetailSection>
                  <DetailSection title="Resultado">{renderTextWithLists(selectedItem.outcome)}</DetailSection>
              </div>
          );
      }
      
      // CharacterItem
      if ('backstory' in selectedItem && 'abilities' in selectedItem) {
          return (
              <div className="space-y-4">
                  <p className='text-sm font-mono text-accent-end'>{selectedItem.affiliation} - {selectedItem.rank}</p>
                  <DetailSection title="Aparência">{renderTextWithLists(selectedItem.appearance)}</DetailSection>
                  <DetailSection title="Personalidade">{renderTextWithLists(selectedItem.personality)}</DetailSection>
                  <DetailSection title="História">{renderTextWithLists(selectedItem.backstory)}</DetailSection>
                  <DetailSection title="Habilidades">{renderTextWithLists(selectedItem.abilities)}</DetailSection>
              </div>
          );
      }
      
      // ConflictItem
      if ('synopsis' in selectedItem && 'scale' in selectedItem) {
          return (
              <div className="space-y-4">
                  <div className='flex gap-4 text-sm font-mono text-accent-end'>
                    <span><strong>Escala:</strong> {selectedItem.scale}</span>
                    <span><strong>Tipo:</strong> {selectedItem.missionType}</span>
                  </div>
                  <DetailSection title="Facções Envolvidas"><p>{selectedItem.factionsInvolved}</p></DetailSection>
                  <DetailSection title="Sinopse">{renderTextWithLists(selectedItem.synopsis)}</DetailSection>
              </div>
          );
      }
      
      // LocationItem
      if ('pointsOfInterest' in selectedItem) {
           return (
              <div className="space-y-4">
                  <p className='text-sm font-mono text-accent-end'>{selectedItem.biome} • {selectedItem.atmosphere}</p>
                  <DetailSection title="Descrição">{renderTextWithLists(selectedItem.description)}</DetailSection>
                  {selectedItem.pointsOfInterest && <DetailSection title="Pontos de Interesse">{renderTextWithLists(selectedItem.pointsOfInterest)}</DetailSection>}
              </div>
          );
      }
      
      // TechniqueItem
      if ('baseElement' in selectedItem) {
          return (
              <div className="space-y-4">
                  <p className='text-sm font-mono text-accent-end'>{selectedItem.type} • {selectedItem.baseElement}</p>
                  <DetailSection title="Descrição">{renderTextWithLists(selectedItem.description)}</DetailSection>
              </div>
          );
      }
      
      // ForgeItem (generic)
      if (selectedItem.content) {
          return <p className="whitespace-pre-wrap leading-relaxed">{selectedItem.content}</p>;
      }

      return <p className="text-text-muted italic">Formato de item não reconhecido.</p>;
  };

  return (
    <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} title={getTitle()} variant='drawer-left'>
      <div className="space-y-4 text-text-secondary h-full flex flex-col">
        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
            <h3 className="text-xl font-semibold text-text-primary font-gangofthree bg-accent-gradient bg-clip-text text-transparent">
                {getTitle()}
            </h3>
            {renderContent()}
        </div>
        <div className="pt-4 flex justify-end mt-auto">
            <Button onClick={closeDetailModal} variant="secondary">
                Fechar
            </Button>
        </div>
      </div>
    </Modal>
  );
};
