"use client"

import { createContext, useCallback, useContext, useRef, useState, type FormEvent, type ReactNode } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ContactButtons } from "@/components/contact-buttons"
import { CONTACT_EMAIL } from "@/lib/contact"
import { PROJECT_FORM_ENDPOINT } from "@/lib/project-form-config"

// "Start a project" popup. Any button can open it with useProjectForm(); submissions go to a
// Google Apps Script web app that appends them to the Teqade Google Sheet
// (integrations/google-sheets/project-form.gs).

const NEEDS = ["New product / MVP", "AI in production", "Data workflows", "Scale or modernize", "Support & maintenance", "Something else"]
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Just exploring"]

type Status = "idle" | "sending" | "sent" | "error"
type Fields = Record<string, string>

const labelClass = "text-xs font-bold uppercase tracking-wider text-foreground"
const inputClass = "h-11 rounded-none bg-background/60"

const ProjectFormContext = createContext<() => void>(() => {})
export const useProjectForm = () => useContext(ProjectFormContext)

// Fallback when the sheet can't be reached: the same details as a ready-to-send email.
const mailtoFor = (f: Fields) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`New project: ${f.company || f.name || "website"}`)}&body=${encodeURIComponent(
    [`Name: ${f.name}`, `Email: ${f.email}`, `Phone: ${f.phone || "-"}`, `Company: ${f.company || "-"}`, `Need: ${f.need}`, `Timeline: ${f.timeline || "-"}`, "", f.brief].join("\n"),
  )}`

const readForm = (form: HTMLFormElement): Fields =>
  Object.fromEntries(Array.from(new FormData(form).entries(), ([key, value]) => [key, String(value).trim()]))

function Optional() {
  return <span className="ml-1.5 font-medium normal-case tracking-normal text-muted-foreground">(optional)</span>
}

function Field({ label, optional = false, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelClass}>
        {label}
        {optional && <Optional />}
      </span>
      {children}
    </label>
  )
}

function Choices({ name, legend, options, selected, required = false }: { name: string; legend: string; options: string[]; selected?: string; required?: boolean }) {
  return (
    <fieldset>
      <legend className={labelClass}>
        {legend}
        {!required && <Optional />}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="relative">
            <input type="radio" name={name} value={option} required={required} defaultChecked={option === selected} className="peer absolute inset-0 cursor-pointer opacity-0" />
            <span className="inline-flex border border-border bg-background/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors peer-hover:border-primary/60 peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function ProjectFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  // The answers so far. The dialog unmounts the form when it closes, so they're saved on close
  // (and on submit) and fed back as default values: closing the popup or a failed send loses nothing.
  const [fields, setFields] = useState<Fields>({})
  const [thanks, setThanks] = useState({ name: "", email: "" })
  const formRef = useRef<HTMLFormElement>(null)

  // Reopening after a successful send starts a fresh form.
  const openForm = useCallback(() => {
    setStatus((current) => (current === "sent" ? "idle" : current))
    setOpen(true)
  }, [])

  function changeOpen(next: boolean) {
    if (!next && formRef.current) setFields(readForm(formRef.current))
    setOpen(next)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { website, ...data } = readForm(event.currentTarget)
    setFields(data)
    const done = () => {
      setThanks({ name: data.name.split(" ")[0], email: data.email })
      setFields({})
      setStatus("sent")
    }
    // Honeypot: visitors never see the "website" field, so anything in it came from a bot.
    if (website) return done()
    if (!PROJECT_FORM_ENDPOINT) return setStatus("error")
    setStatus("sending")
    try {
      // A form-encoded POST is a "simple" request (no CORS preflight); the script replies {"result":"success"}.
      const response = await fetch(PROJECT_FORM_ENDPOINT, { method: "POST", body: new URLSearchParams(data) })
      const reply = await response.json()
      if (reply.result === "success") done()
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <ProjectFormContext.Provider value={openForm}>
      {children}
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-none border-primary/40 bg-card p-6 sm:max-w-xl sm:p-8">
          {status === "sent" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <DialogTitle className="mt-5 text-3xl font-black uppercase leading-none tracking-[-0.05em]">
                Thanks{thanks.name ? `, ${thanks.name}` : ""}.
              </DialogTitle>
              <DialogDescription className="mt-3 max-w-sm text-base">
                We have your project details and will get back to you{thanks.email ? ` at ${thanks.email}` : ""} shortly.
              </DialogDescription>
              <Button onClick={() => setOpen(false)} className="mt-8 rounded-none bg-primary px-8 font-bold text-primary-foreground hover:bg-primary/90">
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="pr-6 text-left sm:text-left">
                <span className="text-xs font-medium uppercase tracking-widest text-primary">Start a project</span>
                <DialogTitle className="text-3xl font-black uppercase leading-none tracking-[-0.05em] sm:text-4xl">
                  Tell us what you&apos;re building.
                </DialogTitle>
                <DialogDescription className="text-base">
                  Call or WhatsApp us now, or answer a few quick questions and we&apos;ll come back with the right next steps.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <ContactButtons />
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or send us the details
                  <span className="h-px flex-1 bg-border" />
                </div>
              </div>

              <form ref={formRef} onSubmit={submit} className="mt-2 flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name">
                    <Input name="name" required maxLength={100} autoComplete="name" defaultValue={fields.name} className={inputClass} />
                  </Field>
                  <Field label="Email">
                    <Input name="email" type="email" required maxLength={200} autoComplete="email" defaultValue={fields.email} className={inputClass} />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" optional>
                    <Input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      maxLength={30}
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      defaultValue={fields.phone}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Company" optional>
                    <Input name="company" maxLength={120} autoComplete="organization" defaultValue={fields.company} className={inputClass} />
                  </Field>
                </div>
                <Choices name="need" legend="What do you need?" options={NEEDS} selected={fields.need} required />
                <Field label="About the project">
                  <Textarea
                    name="brief"
                    defaultValue={fields.brief}
                    required
                    maxLength={3000}
                    rows={4}
                    placeholder="What are you building, and where are you today?"
                    className="min-h-28 rounded-none bg-background/60"
                  />
                </Field>
                <Choices name="timeline" legend="When do you want to start?" options={TIMELINES} selected={fields.timeline} />

                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                {status === "error" && (
                  <p role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-foreground">
                    We couldn&apos;t send that just now. Try again, or{" "}
                    <a href={mailtoFor(fields)} className="font-semibold text-primary underline underline-offset-4">
                      email it to us
                    </a>{" "}
                    instead.
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "sending"}
                  className="hero-button group h-12 rounded-none bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send project details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <p className="-mt-1 text-center text-xs text-muted-foreground">We only use these details to reply to you.</p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ProjectFormContext.Provider>
  )
}
