import { getToken } from './session.js';

export async function registerUser(nickname, password) {
  const r = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password })
  });
  return r.json();
}

export async function loginUser(nickname, password) {
  const r = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password })
  });
  return r.json();
}

export async function getWorlds() {
  const r = await fetch('/api/get-worlds');
  return r.json();
}

export async function likeWorld(worldId) {
  const token = getToken();
  const r = await fetch('/api/like-world', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ worldId })
  });
  return r.json();
}

export async function createWorld({ keyword, userApiKey }) {
  const token = getToken();
  const r = await fetch('/api/worlds/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ keyword, userApiKey })
  });
  return r.json();
}
