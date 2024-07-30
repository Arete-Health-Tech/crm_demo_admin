import useServiceStore from '../../store/serviceStore';
import { createTag, iService, iServiceTag } from '../../types/store/service';
import {
  getServiceTags,
  getAllServices,
  uploadServiceMaster,
  createServiceTag,
  searchServicePck,
  searchServiceAll
} from './service';

export const createServiceHandler = async (parsedData: iService[]) => {
  const { services, setServices } = useServiceStore.getState();
  const servicesAdded = await uploadServiceMaster(parsedData);

  setServices([...services, ...servicesAdded]);
};

export const getAllServicesHandler = async (
  pageNumber: number,
  pageSize: number
) => {
  const { setAllServices } = useServiceStore.getState();
  const fetchServices = await getAllServices(pageNumber, pageSize);
  setAllServices(fetchServices);
};

export const getServiceTagsHandler = async () => {
  const { setServiceTags } = useServiceStore.getState();
  const serviceTags = await getServiceTags();
  setServiceTags(serviceTags);
};

export const createServiceTagsHandler = async (tag: createTag) => {
  const { serviceTags, setServiceTags } = useServiceStore.getState();
  const serviceTagAdded = (await createServiceTag(tag)) as iServiceTag;
  setServiceTags([...serviceTags, serviceTagAdded]);
};

export const getServicePackedHandler = async () => {
  const allServicePacked = await searchServicePck();


}

export const getAllServiceFromDbHandler = async () => {
  const allService = await searchServiceAll();
  const { setServices } = useServiceStore.getState();
  setServices(allService);
};