import useServiceStore from "../../store/serviceStore";
import { getAllNotes } from "./allNotesHandler";

export const getAllNotesWithoutTicketId = async () => {
  const { setAllNotes } = useServiceStore.getState();
  const allNotes = await getAllNotes();
  console.log("p")
  setAllNotes(allNotes);
};
