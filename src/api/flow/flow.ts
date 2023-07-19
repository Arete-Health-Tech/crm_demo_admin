import {
  iNodeConnector,
  iNodeLists,
  iNodeRepliesFlow
} from '../../types/store/node';
import { apiClient } from '../apiClient';

export const createNodeReply = async (nodeReplies: iNodeRepliesFlow[]) => {
  const { data } = await apiClient.post('/flow/reply', nodeReplies);
  return data;
};

export const createNodeList = async (nodeLists: iNodeLists[]) => {
  const { data } = await apiClient.post('/flow/list', nodeLists);
  return data;
};

export const getNodeConnector = async () => {
  const { data } = await apiClient.get('/flow/connect?pageLength=50&page=0');
  return data;
};

export const searchNode = async (query: string) => {
  const { data } = await apiClient.get(`/flow/search?flowQuery=${query}`);
  return data;
};

export const createNodeConnector = async (nodedata: iNodeConnector) => {
  const { data } = await apiClient.post(`/flow/connect`, nodedata);
  return data;
};



