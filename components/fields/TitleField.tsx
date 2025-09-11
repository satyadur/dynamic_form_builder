/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { LuHeading1 } from "react-icons/lu";
import { Button } from "../ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Italic,
  Underline,
} from "lucide-react";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const type: ElementsType = "TitleField";

const extraAttributes = {
  title: "Title field",
  fontSize: 20,
  alignment: "left" as "left" | "center" | "right",
  textColor: "#000000",
  fontWeight: "400" as
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900",
  fontStyle: "normal" as "normal" | "italic",
  textDecoration: "none" as "none" | "underline",
  textTransform: "none" as "none" | "uppercase" | "capitalize" | "lowercase",
  fontFamily: "Arial" as
    | "Arial"
    | "Times New Roman"
    | "Courier New"
    | "Georgia"
    | "Verdana"
    | "Tahoma",
};

const propertiesSchema = z.object({
  title: z.string().min(2).max(50),
  fontSize: z.number().min(10).max(72),
  alignment: z.enum(["left", "center", "right"]),
  textColor: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/),
  fontWeight: z.enum([
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ]),
  fontStyle: z.enum(["normal", "italic"]),
  textDecoration: z.enum(["none", "underline"]),
  textTransform: z.enum(["none", "uppercase", "capitalize", "lowercase"]),
  fontFamily: z.enum([
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Tahoma",
  ]),
});

export const TItleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LuHeading1,
    label: "Title Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const {
    title,
    fontSize,
    alignment,
    textColor,
    fontWeight,
    fontStyle,
    textDecoration,
    textTransform,
    fontFamily,
  } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Title field</Label>
      <p
        className="w-full"
        style={{
          fontSize: `${fontSize}px`,
          textAlign: alignment,
          color: textColor,
          fontWeight,
          fontStyle,
          textDecoration,
          textTransform,
          fontFamily,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const {
    title,
    fontSize,
    alignment,
    textColor,
    fontWeight,
    fontStyle,
    textDecoration,
    textTransform,
    fontFamily,
  } = element.extraAttributes;

  return (
    <p
      className="w-full"
      style={{
        fontSize: `${fontSize}px`,
        textAlign: alignment,
        color: textColor,
        fontWeight,
        fontStyle,
        textDecoration,
        textTransform,
        fontFamily,
      }}
    >
      {title}
    </p>
  );
}

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();

  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: element.extraAttributes,
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: { ...values },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Font Size */}
        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size</FormLabel>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                  min={10}
                  max={72}
                  step={1}
                />
              </FormControl>
              <FormDescription>{field.value}px</FormDescription>
            </FormItem>
          )}
        />

        {/* Alignment */}
        <FormField
          control={form.control}
          name="alignment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alignment</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={field.value === "left" ? "default" : "outline"}
                    size="icon"
                    onClick={() => field.onChange("left")}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === "center" ? "default" : "outline"}
                    size="icon"
                    onClick={() => field.onChange("center")}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === "right" ? "default" : "outline"}
                    size="icon"
                    onClick={() => field.onChange("right")}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Text Color */}
        <FormField
          control={form.control}
          name="textColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Color</FormLabel>
              <FormControl>
                <input
                  type="color"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="h-10 w-16 p-1 border rounded cursor-pointer"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Font Weight */}
        <FormField
          control={form.control}
          name="fontWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Weight</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    applyChanges({
                      ...form.getValues(),
                      fontWeight: value as any,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">Thin (100)</SelectItem>
                    <SelectItem value="200">Extra Light (200)</SelectItem>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                    <SelectItem value="900">Black (900)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Font Style (Italic) */}
        <FormField
          control={form.control}
          name="fontStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Italic</FormLabel>
              <FormControl>
                <Button
                  type="button"
                  variant={field.value === "italic" ? "default" : "outline"}
                  size="icon"
                  onClick={() =>
                    field.onChange(
                      field.value === "italic" ? "normal" : "italic"
                    )
                  }
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Text Decoration (Underline) */}
        <FormField
          control={form.control}
          name="textDecoration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Underline</FormLabel>
              <FormControl>
                <Button
                  type="button"
                  variant={field.value === "underline" ? "default" : "outline"}
                  size="icon"
                  onClick={() =>
                    field.onChange(
                      field.value === "underline" ? "none" : "underline"
                    )
                  }
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Capitalization (ShadCN Select) */}
        <FormField
          control={form.control}
          name="textTransform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capitalization</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    applyChanges({
                      ...form.getValues(),
                      textTransform: value as any,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select capitalization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    <SelectItem value="capitalize">Capitalize</SelectItem>
                    <SelectItem value="lowercase">lowercase</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Font Family (ShadCN Select) */}
        <FormField
          control={form.control}
          name="fontFamily"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Family</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">
                      Times New Roman
                    </SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                    <SelectItem value="Tahoma">Tahoma</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
