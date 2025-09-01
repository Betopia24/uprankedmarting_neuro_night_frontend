import RatingViewer from "@/components/RatingViewer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShowFeedback() {
  return (
    <div className="p-4">
      <FeedBackMode />
      <FeedbackStat />
      <RatingStat />
    </div>
  );
}

function FeedBackMode() {
  return (
    <div className="sticky top-4">
      <Select>
        <SelectTrigger className="w-full border-0 shadow-none font-semibold text-lg">
          <SelectValue placeholder="Feedback" />
        </SelectTrigger>
        <SelectContent position="popper" className="z-50">
          <SelectItem value="agent">Agent Feedback</SelectItem>
          <SelectItem value="organization">Organization Feedback</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function FeedbackStat() {
  return (
    <div className="p-4">
      <div className="bg-blue-500 text-white rounded-3xl aspect-square max-w-40 mx-auto flex flex-col gap-1 items-center justify-center">
        <span className="text-2xl font-bold">4.8</span>
        <RatingViewer rating={3} size={24} />
        <span>2005 Rating</span>
      </div>
    </div>
  );
}

function RatingStat() {
  return (
    <div className="p-2">
      <div className=""></div>
      <div className=""></div>
      <div className=""></div>
      <div className=""></div>
      <div className=""></div>
    </div>
  );
}
