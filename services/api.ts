const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  async createNote(data: { title: string; content: any; userId: string }) {
    const response = await fetch(`${API_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create note');
    return response.json();
  },

  async getNotes(userId?: string) {
    const url = userId
      ? `${API_URL}/api/notes?userId=${userId}`
      : `${API_URL}/api/notes`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async getNote(noteId: string) {
    const response = await fetch(`${API_URL}/api/notes/${noteId}`);
    if (!response.ok) throw new Error('Failed to fetch note');
    return response.json();
  },

  async updateNote(
    noteId: string,
    data: { title?: string; content?: any; userId: string }
  ) {
    const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  async deleteNote(noteId: string) {
    const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
    return response.json();
  },

  async getVersions(noteId: string) {
    const response = await fetch(`${API_URL}/api/notes/${noteId}/versions`);
    if (!response.ok) throw new Error('Failed to fetch versions');
    return response.json();
  },

  async restoreVersion(noteId: string, versionId: string, userId: string) {
    const response = await fetch(
      `${API_URL}/api/notes/${noteId}/restore-version`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId, userId }),
      }
    );
    if (!response.ok) throw new Error('Failed to restore version');
    return response.json();
  },

  async createUser(data: { name: string; email: string }) {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async inviteCollaborator(noteId: string, email: string) {
    const response = await fetch(`${API_URL}/api/notes/${noteId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Failed to invite collaborator');
    return response.json();
  },
};
