import QuestionList from "@/features/organization/lead-questions/QuestionList";
import { Accordion } from "../_components/Accordion";
import { AccordionItem } from "../_components/AccordionItem";
import AIManagement from "../_components/AIManagement";
import VoiceUpload from "../_components/VoiceUpload";
import OrganizationDocumentUpload from "../_components/DocumentUpload";

export default function page() {
  return (
    <Accordion>
      <AccordionItem id="Lead Questions" title="Lead Questions">
        <QuestionList />
      </AccordionItem>
      <AccordionItem id="Voice Upload" title="Voice">
        <VoiceUpload />
      </AccordionItem>
      <AccordionItem id="Document Upload" title="Document">
        <OrganizationDocumentUpload />
      </AccordionItem>
      <AccordionItem id="AI Management" title="AI">
        <AIManagement />
      </AccordionItem>
    </Accordion>
  );
}
