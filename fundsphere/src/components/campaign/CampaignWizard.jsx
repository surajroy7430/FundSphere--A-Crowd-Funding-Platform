import { useState } from "react";
import { z } from "zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Card, CardContent, CardAction } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFetch } from "../../hooks/use-fetch";
import MediaUploader from "./MediaUploader";
import PreviewPanel from "./PreviewPanel";

// Zod schema
const MilestoneSchema = z.object({
  percentage: z.preprocess(
    (v) => Number(v),
    z
      .number({ invalid_type_error: "percentage must be a number" })
      .min(1)
      .max(100)
  ),
  description: z.string().min(1, "milestone description required"),
});

const CampaignSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description too short"),
  goalAmount: z.preprocess(
    (v) => Number(v),
    z.number().min(1, "Goal must be greater than 0")
  ),
  milestones: z.array(MilestoneSchema).optional(),
  media: z.array(z.string()).optional(),
  deadline: z
    .preprocess(
      (v) => (v ? new Date(v) : v),
      z.date({ invalid_type_error: "Invalid date" })
    )
    .refine((date) => date > new Date()),
});

const CampaignWizard = () => {
  const { request, loading } = useFetch();
  const [step, setStep] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [campaignId, setCampaignId] = useState(null);

  const form = useForm({
    resolver: zodResolver(CampaignSchema),
    defaultValues: {
      title: "",
      description: "",
      goalAmount: "",
      deadline: "",
      milestones: [{ percentage: 25, description: "Initial milestone" }],
      media: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  // Step navigation
  const next = async () => {
    if (step === 1 && !campaignId) {
      const values = form.getValues();
      const res = await handleCreateCampaign(values);
      if (!res) return;
    }

    setStep((s) => Math.min(3, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const handleCreateCampaign = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      goalAmount: values.goalAmount,
      deadline: values.deadline,
      milestones: values.milestones,
    };

    const res = await request({
      url: "/api/campaigns",
      method: "POST",
      data: payload,
    });

    if (res.success) {
      setCampaignId(res.data.campaign._id);
      return res.data.campaign;
    }
    return null;
  };

  // Final submit -> publish campaign
  const onSubmit = async (values) => {
    try {
      if (!campaignId) {
        toast.error(
          "Campaign draft missing. Please go back and create it first."
        );
        return;
      }

      const publishRes = await request({
        url: `/api/campaigns/${campaignId}/publish`,
        method: "PATCH",
        data: { status: "published" },
        showToast: false,
      });

      if (publishRes.success) {
        toast.success("Campaign Published");
        form.reset();
        setMediaFiles([]);
        setStep(0);
        setCampaignId(null);
      }
    } catch (err) {
      // console.error(err);
    }
  };

  const onError = (err) => {
    console.log("VALIDATION-ERROR:", err);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-semibold">Start a Campaign 🚀</h2>
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-6"
                noValidate
              >
                {step === 0 && (
                  <>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="campaign title" />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.title?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your campaign goals, story and use of funds"
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.description?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
                      <FormField
                        control={form.control}
                        name="goalAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Goal Amount (₹)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Example: 50000"
                                min={1}
                              />
                            </FormControl>
                            <FormMessage>
                              {form.formState.errors.goalAmount?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deadline</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full text-left"
                                >
                                  {field.value
                                    ? field.value.toLocaleDateString()
                                    : "Select a Date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage>
                              {form.formState.errors.deadline?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Milestones</h3>
                    {fields.map((f, idx) => (
                      <div
                        key={f.id}
                        className="grid grid-cols-3 gap-3 items-end"
                      >
                        <Controller
                          control={form.control}
                          name={`milestones.${idx}.percentage`}
                          render={({ field }) => (
                            <div>
                              <Label className="block text-sm">
                                Percentage
                              </Label>
                              <Input
                                {...field}
                                type="number"
                                min={1}
                                max={100}
                              />
                            </div>
                          )}
                        />

                        <Controller
                          control={form.control}
                          name={`milestones.${idx}.description`}
                          render={({ field }) => (
                            <div className="col-span-2">
                              <Label className="block text-sm">
                                Description
                              </Label>
                              <Input
                                {...field}
                                placeholder="E.g., Reach 25% to start prototype"
                              />
                            </div>
                          )}
                        />

                        <div className="col-span-3 flex gap-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(idx)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <CardAction>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({ percentage: 10, description: "" })
                        }
                      >
                        Add Milestone
                      </Button>
                    </CardAction>
                  </div>
                )}

                {step === 2 && (
                  <>
                    <h3 className="text-lg font-medium">Media Uploads</h3>
                    <MediaUploader
                      campaignId={campaignId}
                      mediaFiles={mediaFiles}
                      setMediaFiles={setMediaFiles}
                      onUploaded={(url) => {
                        const curr = form.getValues("media") || [];
                        form.setValue("media", [...curr, url], {
                          shouldDirty: true,
                        });
                      }}
                    />

                    <div className="mt-4">
                      <div className="mt-2 flex flex-wrap gap-2">
                        {mediaFiles.map((m, i) => {
                          const isImage =
                            m.file?.type?.startsWith("image/") ||
                            (typeof m.url === "string" &&
                              m.url.match(/\.(jpeg|jpg|png|webp|gif)$/i));

                          const isVideo =
                            m.file?.type?.startsWith("video/") ||
                            (typeof m.url === "string" &&
                              m.url.match(/\.(mp4|mkv)$/i));

                          return (
                            <div
                              key={i}
                              className="border rounded p-1 w-28 h-20 overflow-hidden"
                            >
                              {isImage ? (
                                <img
                                  src={m.url}
                                  alt={`media-${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : isVideo ? (
                                <video
                                  src={m.url}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs">
                                  {m.status === "uploading"
                                    ? "Uploading..."
                                    : "Unsupported"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="text-lg font-medium">Review & Publish</h3>
                    <div className="space-y-2">
                      <strong>Title:</strong> {form.getValues("title")}
                      <div>
                        <strong>Description:</strong>
                        <p className="prose max-w-none">
                          {form.getValues("description")}
                        </p>
                      </div>
                      <div>
                        <strong>Goal:</strong> ₹{form.getValues("goalAmount")}
                      </div>
                      <div>
                        <strong>Deadline:</strong> ₹
                        {form.getValues("deadline").toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Milestones:</strong>
                        <ul className="list-disc list-inside">
                          {(form.getValues("milestones") || []).map((m, i) => (
                            <li key={i}>
                              {m.percentage}% — {m.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                <CardAction className="flex gap-2 justify-between mt-4">
                  <div>
                    {step > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={prev}
                      >
                        Back
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {step < 3 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                          if (step === 1 && !campaignId) {
                            // create draft campaign
                            const values = form.getValues();
                            const created = await handleCreateCampaign(values);
                            if (!created) return;
                          }
                          next();
                        }}
                      >
                        Next
                      </Button>
                    )}

                    {step === 3 && (
                      <Button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 tracking-[1px] "
                        disabled={loading}
                      >
                        {loading ? "Publishing..." : "Publish Campaign"}
                      </Button>
                    )}
                  </div>
                </CardAction>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <PreviewPanel watch={form.watch} />
      </div>
    </div>
  );
};

export default CampaignWizard;
