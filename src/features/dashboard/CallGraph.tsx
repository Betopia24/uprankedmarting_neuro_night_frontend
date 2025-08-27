import { Heading } from "@/components";
import CircleGraph from "@/features/dashboard/CircleStats";

const data = [
  { name: "Total Call", value: 50, max: 200, color: "red" },
  {
    name: "Total Success Call",
    value: 100,
    max: 200,
    color: "green",
  },
  {
    name: "Total AI Call",
    value: 100,
    max: 200,
    color: "red",
  },
  {
    name: "Total Agent Call",
    value: 100,
    max: 200,
    color: "blue",
  },
  {
    name: "Total Customer Call",
    value: 100,
    max: 200,
    color: "yellow",
  },
  {
    name: "Total Failed Call",
    value: 100,
    max: 200,
    color: "red",
  },
];

export default function CallGraph() {
  return (
    <div className="flex flex-wrap justify-center">
      {data.map((item, index) => (
        <div
          className="flex flex-col flex-1 shrink-0 basis-1/1 sm:basis-1/2 md:basis-1/3 p-2"
          key={index}
        >
          <div className="bg-[#eee] rounded-3xl py-6">
            <Heading className="px-10" as="h3" size="sm">
              {item.name}
            </Heading>
            <div className="size-full flex items-center justify-center rounded-3xl">
              <CircleGraph
                value={item.value}
                max={item.max}
                color={item.color}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
