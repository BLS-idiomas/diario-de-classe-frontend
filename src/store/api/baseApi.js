'use client';

import axios from 'axios';

export class BaseApi {
  constructor() {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get(endpoint, params = {}) {
    return await this.api.get(endpoint, { params });
  }

  async post(endpoint, data) {
    return await this.api.post(endpoint, data);
  }

  async put(endpoint, data) {
    return await this.api.put(endpoint, data);
  }

  async destroy(endpoint) {
    return await this.api.delete(endpoint);
  }
}
