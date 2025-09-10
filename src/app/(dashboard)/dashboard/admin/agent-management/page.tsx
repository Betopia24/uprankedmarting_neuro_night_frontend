"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

type Member = {
  id: number;
  name: string;
  role: string;
  rating: number;
  description: string;
  organization: number;
  handleCall: number;
  image: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {members.map((member) => (
        <Card
          key={member.id}
          className="p-6 flex flex-col items-center text-center shadow-lg rounded-2xl"
        >
          <Image
            src={member.image}
            alt={member.name}
            className="w-24 h-24 rounded-full object-cover -mt-12 border-4 border-white shadow"
          />
          <h2 className="mt-4 text-lg font-semibold">{member.name}</h2>
          <p className="text-sm text-muted-foreground">{member.role}</p>

          {/* ⭐ Rating */}
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < member.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          {/* Description */}
          <p className="mt-3 text-sm text-gray-600">{member.description}</p>

          {/* Button */}
          <Button className="mt-4 w-full">Select</Button>

          {/* Footer stats */}
          <div className="flex justify-between w-full mt-4 border-t pt-3 text-sm">
            <div>
              <p className="font-semibold">{member.organization}</p>
              <p className="text-gray-500">Organization</p>
            </div>
            <div>
              <p className="font-semibold">{member.handleCall}</p>
              <p className="text-gray-500">Handle Call</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
