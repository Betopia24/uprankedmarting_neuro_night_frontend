"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewNumberListPage from "./_components/ViewNumberList";
import ViewRequestNumberListPage from "./_components/ViewRequestNumberList";
const NumberPage = () => {
  return (
    <Tabs defaultValue="view_number_list" className="">
      <TabsList>
        <TabsTrigger value="view_number_list">View Number List</TabsTrigger>
        <TabsTrigger value="view_requested_number_list">
          View Requested Number List
        </TabsTrigger>
      </TabsList>
      <TabsContent value="view_number_list">
        <ViewNumberListPage />
      </TabsContent>
      <TabsContent value="view_requested_number_list">
        <ViewRequestNumberListPage />
      </TabsContent>
    </Tabs>
  );
};

export default NumberPage;
