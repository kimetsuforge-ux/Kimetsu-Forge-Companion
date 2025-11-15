

import React from 'react';
import { Modal } from '../ui/Modal';
import { useCoreUI } from '../../contexts/AppContext';
import { Button } from '../ui/Button';

export const DetailModal: React.FC = () => {
  const { isDetailModalOpen, closeDetailModal, selectedItem } = useCoreUI();

  const getTitle = () => {
    if (!selectedItem) return "Detalhes";
    return selectedItem.name || selectedItem.title || "Detalhes do Item";
  };

  const getContent = () => {
      if (!selectedItem) return null;
      // Handle different item structures
      if (selectedItem.content) return selectedItem.content; // ForgeItem
      if (selectedItem.synopsis) { // ConflictItem
          return `**Escala:** ${selectedItem.scale}\n**Tipo de Missão:** ${selectedItem.missionType}\n**Facções Envolvidas:** ${selectedItem.factionsInvolved}\n\n**Sinopse:**\n${selectedItem.synopsis}`;
      }
      if (selectedItem.backstory) { // CharacterItem
          return `**Afiliação:** ${selectedItem.affiliation}\n**Classe:** ${selectedItem.rank}\n\n**Aparência:**\n${selectedItem.appearance}\n\n**Personalidade:**\n${selectedItem.personality}\n\n**História:**\n${selectedItem.backstory}\n\n**Habilidades:**\n${selectedItem.abilities}`;
      }
      if (selectedItem.description) { // TechniqueItem or LocationItem
          if(selectedItem.pointsOfInterest) { // LocationItem
            return `${selectedItem.description}\n\n**Pontos de Interesse:**\n${selectedItem.pointsOfInterest}`;
          }
          return selectedItem.description; // TechniqueItem
      }
      return "Conteúdo não disponível.";
  };


  return (
    <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} title={getTitle()} variant='drawer-left'>
      <div className="space-y-4 text-text-secondary h-full flex flex-col">
        {selectedItem ? (
          <div className="flex-grow space-y-4 overflow-y-auto pr-2">
              <h3 className="text-xl font-semibold text-text-primary font-gangofthree bg-accent-gradient bg-clip-text text-transparent">
                  {getTitle()}
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed">
                  {getContent()}
              </p>
          </div>
        ) : (
          <div className="p-4 bg-bg-primary border border-border-color rounded-md flex-grow flex items-center justify-center">
            <p className="text-text-muted italic">Nenhum item selecionado...</p>
          </div>
        )}
        
        <div className="pt-4 flex justify-end mt-auto">
            <Button onClick={closeDetailModal} variant="secondary">
                Fechar
            </Button>
        </div>
      </div>
    </Modal>
  );
};
