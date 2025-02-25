'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Select, MenuItem, Box, styled } from '@mui/material';

const BoardContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateAreas: `
    "template"
    "board"
  `,
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    gridTemplateAreas: `
      "template board"
    `,
    gridTemplateColumns: '200px 1fr',
  },
}));

interface BoardGridProps {
  columns: string[];
}

const BoardGrid = styled(Box)<BoardGridProps>(({ theme, columns }) => ({
  display: 'grid',
  gridTemplateColumns: columns.length > 0
    ? `repeat(${columns.length}, minmax(300px, 1fr))`
    : 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(2),
  gridArea: 'board',
}));

interface KanbanBoardProps {
  initialCards: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

interface Template {
  id: string;
  name: string;
  description: string;
  columns: string[];
}

export default function KanbanBoard({ initialCards }: KanbanBoardProps) {
  const [cards, setCards] = useState(initialCards);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [columns, setColumns] = useState<string[]>([]);

  const handleTemplateChange = (templateId: string) => {
    const selected = templates.find(t => t.id === templateId);
    if (selected) {
      setColumns(selected.columns);
      // Reset cards based on new template
      setCards(selected.columns.map((col, index) => ({
        id: `col-${index}`,
        title: col,
        content: '',
      })));
    }
  };

  useEffect(() => {
    fetch('/api/dashboard/analysis/templates')
      .then(res => res.json())
      .then(data => setTemplates(data));
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <BoardContainer>
      <Box sx={{ gridArea: 'template' }}>
        <Select
          value={selectedTemplate}
          onChange={(e) => {
            setSelectedTemplate(e.target.value);
            handleTemplateChange(e.target.value);
          }}
          fullWidth
        >
          {templates.map(template => (
            <MenuItem key={template.id} value={template.id}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <BoardGrid columns={columns}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cards} strategy={verticalListSortingStrategy}>
            {cards.map(card => (
              <KanbanCard key={card.id} id={card.id} title={card.title} content={card.content} />
            ))}
          </SortableContext>
        </DndContext>
      </BoardGrid>
    </BoardContainer>
  );
}