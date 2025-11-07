"use client"
import {
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Textarea
} from "@/components/ui/textarea"
import { env } from "@/env"
import { useAuth } from "@/components/AuthProvider"

const formSchema = z.object({
  requesterName: z.string().min(1),
  requestedPhonePattern: z.string().min(1),
  message: z.string()
});

export default function RequestNumberForm() {

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),

  // })
  // const { token } = useAuth();

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   if (!token) return;
  //   try {
  //     const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/organization/request`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token || "",
  //       },
  //       body: JSON.stringify(values),
  //     })
  //     const json = await response.json();
  //     if (!json.success) {
  //       throw new Error(json.message || "Failed to submit the form.");
  //     }
  //     toast.success("Number request submitted successfully!");
  //   } catch (error: any) {
  //     toast.error(error?.message || "Something went wrong");
  //   }
  // }

  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;
    try {
      setLoading(true);

      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers/organization/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(values),
      });

      const json = await response.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to submit the form.");
      }

      toast.success("Number request submitted successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full py-10">

        <FormField
          control={form.control}
          name="requesterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requester Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"

                  type="text"
                  {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requestedPhonePattern"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Pattern</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter requesting phone num. pattern"

                  type="text"
                  {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
        {/* <Button type="submit">Send</Button> */}
      </form>
    </Form>
  )
}