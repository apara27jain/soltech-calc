CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  pin_code TEXT,
  landmark TEXT,
  timeline TEXT NOT NULL,
  roof_type TEXT NOT NULL,
  terrace_size TEXT NOT NULL,
  power_cuts TEXT NOT NULL,
  bill_range TEXT NOT NULL,
  recommended_kw NUMERIC NOT NULL,
  monthly_generation_kwh NUMERIC,
  monthly_savings NUMERIC NOT NULL,
  annual_savings NUMERIC NOT NULL,
  five_year_savings NUMERIC NOT NULL,
  source TEXT,
  campaign TEXT,
  whatsapp_status TEXT NOT NULL DEFAULT 'not_configured',
  whatsapp_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.lead_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX lead_notifications_lead_id_idx ON public.lead_notifications (lead_id);

GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.lead_notifications TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notifications ENABLE ROW LEVEL SECURITY;