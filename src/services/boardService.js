import api from './api'

export const boardService = {
  getAll:  ()           => api.get('/boards'),
  getOne:  (id)         => api.get(`/boards/${id}`),
  create:  (data)       => api.post('/boards', data),
  update:  (id, data)   => api.put(`/boards/${id}`, data),
  remove:  (id)         => api.delete(`/boards/${id}`),
}

export const listService = {
  getByBoard: (boardId) => api.get(`/lists/board/${boardId}`),
  create:     (data)    => api.post('/lists', data),
  update:     (id, data)=> api.put(`/lists/${id}`, data),
  remove:     (id)      => api.delete(`/lists/${id}`),
}

export const cardService = {
  getByList:  (listId)  => api.get(`/cards/list/${listId}`),
  getOne:     (id)      => api.get(`/cards/${id}`),
  create:     (data)    => api.post('/cards', data),
  update:     (id, data)=> api.put(`/cards/${id}`, data),
  remove:     (id)      => api.delete(`/cards/${id}`),
  addChecklist:    (id, text)       => api.post(`/cards/${id}/checklist`, { text }),
  toggleChecklist: (id, itemId)     => api.put(`/cards/${id}/checklist/${itemId}`),
}