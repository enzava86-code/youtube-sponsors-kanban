"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CreateSponsorshipData, ContentType, Currency, PaymentMethod, SponsorshipStatus, Priority } from "@/types/sponsorship";

const formSchema = z.object({
  // Información de la marca
  brandName: z.string().min(1, "El nombre de la marca es requerido"),
  contactPerson: z.string().min(1, "El contacto principal es requerido"),
  contactEmail: z.string().email("Email inválido"),
  
  // Detalles del acuerdo
  title: z.string().min(1, "El título del acuerdo es requerido"),
  type: z.enum(["video", "short", "stream", "community_post", "integration", "mention"]),
  description: z.string().optional(),
  category: z.string().min(1, "La categoría es requerida"),
  
  // Información financiera
  monetaryValue: z.number().min(0, "El monto debe ser mayor a 0"),
  currency: z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]),
  paymentMethod: z.enum(["paypal", "bank_transfer", "wise", "stripe", "crypto"]),
  
  // Fechas
  startDate: z.date().optional(),
  deliveryDate: z.date(),
  publishDate: z.date().optional(),
  isFlexiblePublishDate: z.boolean().default(false),
  
  // Estado inicial
  initialStatus: z.enum([
    "prospect", "initial_contact", "negotiation", "proposal_sent", 
    "contract_signed", "content_production", "client_review", "published", "completed"
  ]).default("prospect"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  
  // Notas
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateSponsorshipModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSponsorshipData) => void;
  initialStatus?: SponsorshipStatus;
}

export function CreateSponsorshipModal({
  open,
  onClose,
  onSubmit,
  initialStatus = "prospect"
}: CreateSponsorshipModalProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialStatus,
      priority: "medium",
      currency: "EUR",
      paymentMethod: "paypal",
      type: "video",
      isFlexiblePublishDate: false,
    },
  });

  const handleSubmit = (data: FormData) => {
    const formattedData: CreateSponsorshipData = {
      ...data,
      startDate: data.startDate,
      deliveryDate: data.deliveryDate,
      publishDate: data.publishDate,
    };
    
    onSubmit(formattedData);
    form.reset();
    setLogoFile(null);
    setAttachments([]);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'attachments') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'logo') {
      setLogoFile(files[0]);
    } else {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const contentTypes: { value: ContentType; label: string }[] = [
    { value: "video", label: "Video" },
    { value: "short", label: "Short" },
    { value: "stream", label: "Stream en vivo" },
    { value: "community_post", label: "Post de comunidad" },
    { value: "integration", label: "Integración en video" },
    { value: "mention", label: "Mención" },
  ];

  const currencies: { value: Currency; label: string }[] = [
    { value: "EUR", label: "EUR (€)" },
    { value: "USD", label: "USD ($)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
    { value: "CAD", label: "CAD" },
    { value: "AUD", label: "AUD" },
  ];

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Transferencia bancaria" },
    { value: "wise", label: "Wise" },
    { value: "stripe", label: "Stripe" },
    { value: "crypto", label: "Criptomonedas" },
  ];

  const statusOptions: { value: SponsorshipStatus; label: string }[] = [
    { value: "prospect", label: "Prospecto" },
    { value: "initial_contact", label: "Contacto inicial" },
    { value: "negotiation", label: "Negociación" },
    { value: "proposal_sent", label: "Propuesta enviada" },
    { value: "contract_signed", label: "Contrato firmado" },
    { value: "content_production", label: "Contenido en producción" },
    { value: "client_review", label: "Revisión del cliente" },
    { value: "published", label: "Publicado" },
    { value: "completed", label: "Completado" },
  ];

  const priorityOptions: { value: Priority; label: string }[] = [
    { value: "low", label: "Baja" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
    { value: "urgent", label: "Urgente" },
  ];

  const categories = [
    "Tecnología",
    "Gaming",
    "Lifestyle",
    "Educación",
    "Entretenimiento",
    "Belleza",
    "Fitness",
    "Cocina",
    "Viajes",
    "Finanzas",
    "Otros"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Acuerdo de Patrocinio</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Accordion type="multiple" defaultValue={["brand", "deal"]} className="w-full">
                
                {/* Información de la Marca */}
                <AccordionItem value="brand">
                  <AccordionTrigger>Información de la Marca</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brandName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la Marca *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de la marca" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contacto Principal *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del contacto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de Contacto *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contacto@marca.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Logo de la Marca</FormLabel>
                      <div className="mt-2">
                        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              {logoFile ? logoFile.name : "Subir logo"}
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'logo')}
                          />
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Detalles del Acuerdo */}
                <AccordionItem value="deal">
                  <AccordionTrigger>Detalles del Acuerdo</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título del Acuerdo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Título descriptivo del acuerdo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Contenido *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {contentTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoría *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descripción detallada del acuerdo..."
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Información Financiera */}
                <AccordionItem value="financial">
                  <AccordionTrigger>Información Financiera</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="monetaryValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto del Patrocinio *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moneda</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency.value} value={currency.value}>
                                    {currency.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forma de Pago</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {paymentMethods.map((method) => (
                                  <SelectItem key={method.value} value={method.value}>
                                    {method.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Fechas y Plazos */}
                <AccordionItem value="dates">
                  <AccordionTrigger>Fechas y Plazos</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha de Inicio</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha de Entrega *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="publishDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha de Publicación</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isFlexiblePublishDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Fecha de publicación flexible
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Estado Inicial */}
                <AccordionItem value="status">
                  <AccordionTrigger>Estado Inicial</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="initialStatus"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Columna de Destino</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-3 gap-4"
                            >
                              {statusOptions.slice(0, 6).map((status) => (
                                <FormItem key={status.value} className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={status.value} />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {status.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prioridad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Notas y Archivos */}
                <AccordionItem value="notes">
                  <AccordionTrigger>Notas y Archivos</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas Adicionales</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Notas internas, comentarios especiales..."
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Archivos Adjuntos</FormLabel>
                      <div className="mt-2">
                        <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex flex-col items-center">
                            <Upload className="h-6 w-6 text-gray-400" />
                            <p className="mt-1 text-sm text-gray-500">
                              Subir archivos
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => handleFileUpload(e, 'attachments')}
                          />
                        </label>
                      </div>
                      
                      {attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <span className="text-sm truncate">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="secondary" onClick={() => {
            // Guardar como borrador lógica
            console.log("Guardar como borrador");
          }}>
            Guardar como Borrador
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            Crear Acuerdo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}