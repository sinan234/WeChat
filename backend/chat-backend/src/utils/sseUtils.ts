import { Response } from 'express';

const clients: Array<Response> = [];

export const addClient = (res: Response): void => {
  clients.push(res);
};

export const removeClient = (res: Response): void => {
  const index = clients.indexOf(res);
  if (index !== -1) clients.splice(index, 1);
};

export const sendEventsToClients = (message: any): void => {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(message)}\n\n`);
  });
};
