import React, { useEffect, useRef, useState } from "react"
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  Loader2,
  SlidersHorizontal,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApiKeysStatus, useSaveApiKeys } from "@/hooks/useApiKeys"
import {
  DEFAULT_SOURCES,
  MAX_SOURCES,
  MIN_SOURCES,
} from "@/services/settings.service"
import type { SaveApiKeysPayload } from "@/services/settings.service"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api-errors"

interface ApiKeyFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  configured: boolean | undefined
  helperText: string
  helperUrl: string
  onChange: (value: string) => void
}

const ApiKeyField: React.FC<ApiKeyFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  configured,
  helperText,
  helperUrl,
  onChange,
}) => {
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {configured === undefined ? (
          <span className="label-eyebrow">Checking…</span>
        ) : configured ? (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Configured ✓
          </span>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">Not configured</span>
        )}
      </div>

      <div className="relative">
        <Input
          id={id}
          type={showKey ? "text" : "password"}
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pr-11 font-mono"
        />
        <button
          type="button"
          onClick={() => setShowKey((prev) => !prev)}
          aria-label={showKey ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        Get a key at{" "}
        <a
          href={helperUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-primary underline-offset-2 hover:underline"
        >
          {helperText}
          <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </div>
  )
}

export const SettingsPage: React.FC = () => {
  const { data: status, isLoading: isStatusLoading, isError: isStatusError } = useApiKeysStatus()
  const saveMutation = useSaveApiKeys()

  const [geminiKey, setGeminiKey] = useState("")
  const [exaKey, setExaKey] = useState("")
  const [maxSources, setMaxSources] = useState(DEFAULT_SOURCES)
  const [justSaved, setJustSaved] = useState(false)
  const hasHydratedSourcesRef = useRef(false)

  useEffect(() => {
    if (!hasHydratedSourcesRef.current && status && typeof status.maxSources === "number") {
      setMaxSources(status.maxSources)
      hasHydratedSourcesRef.current = true
    }
  }, [status])

  const savedMaxSources = status?.maxSources ?? DEFAULT_SOURCES

  const handleGeminiChange = (value: string) => {
    setGeminiKey(value)
    setJustSaved(false)
  }

  const handleExaChange = (value: string) => {
    setExaKey(value)
    setJustSaved(false)
  }

  const handleSave = () => {
    const payload: SaveApiKeysPayload = {}
    if (geminiKey.trim()) payload.geminiApiKey = geminiKey.trim()
    if (exaKey.trim()) payload.exaApiKey = exaKey.trim()

    if (Object.keys(payload).length === 0 && maxSources !== savedMaxSources) {
      payload.maxSources = maxSources
    }

    if (Object.keys(payload).length === 0) {
      toast.error("Enter at least one API key or adjust the number of sources to save.")
      return
    }

    saveMutation.mutate(payload, {
      onSuccess: (data) => {
        setGeminiKey("")
        setExaKey("")
        setMaxSources(data.maxSources)
        setJustSaved(true)
        toast.success("Settings saved securely.")
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Couldn't save your settings. Please try again."))
      },
    })
  }

  return (
    <div className="flex w-full animate-fade-in flex-col gap-5 py-2">
      <div className="px-1">
        <span className="label-eyebrow">Account</span>
        <h1 className="mt-1 font-display text-3xl font-medium text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bring your own API keys. They're encrypted and only used to run your research requests.
        </p>
      </div>

      <Card className="w-full overflow-hidden rounded-3xl border-border/80 bg-card/70 shadow-soft-lg backdrop-blur-xl">
        <CardHeader className="border-b border-border/70 px-6 pb-6 pt-7 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted shadow-soft-xs">
              <KeyRound className="h-4 w-4 text-primary" />
            </span>
            <div>
              <CardTitle className="font-display text-lg font-medium text-foreground">API Configuration</CardTitle>
              <CardDescription className="mt-0.5">
                ScrapKaro.AI needs both keys before it can plan and search for you.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 px-6 py-7 sm:px-8">
          {isStatusError && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              Couldn't load your current configuration. Please check that the backend is running.
            </p>
          )}

          <ApiKeyField
            id="gemini-api-key"
            label="Gemini API Key"
            placeholder="AIza…"
            value={geminiKey}
            configured={status?.geminiConfigured}
            helperText="Google AI Studio"
            helperUrl="https://aistudio.google.com/apikey"
            onChange={handleGeminiChange}
          />

          <ApiKeyField
            id="exa-api-key"
            label="Exa API Key"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={exaKey}
            configured={status?.exaConfigured}
            helperText="exa.ai Dashboard"
            helperUrl="https://dashboard.exa.ai/api-keys"
            onChange={handleExaChange}
          />

          <div className="space-y-4 border-t border-border/70 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <Label htmlFor="max-sources" className="cursor-default">
                  Number of sources
                </Label>
              </div>
              <span className="rounded-full border border-primary/30 bg-accent px-3 py-0.5 font-display text-sm font-semibold text-primary shadow-soft-xs">
                {maxSources} {maxSources === 1 ? "source" : "sources"}
              </span>
            </div>

            <input
              id="max-sources"
              type="range"
              min={MIN_SOURCES}
              max={MAX_SOURCES}
              step={1}
              value={maxSources}
              onChange={(event) => {
                setMaxSources(Number(event.target.value))
                setJustSaved(false)
              }}
              aria-valuemin={MIN_SOURCES}
              aria-valuemax={MAX_SOURCES}
              aria-valuenow={maxSources}
              className="h-2 w-full cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{MIN_SOURCES} — quicker run</span>
              <span>{MAX_SOURCES} — most thorough</span>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Applies to future research runs. More sources means more search results
              evaluated by AI, so runs may take slightly longer.
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Keys are encrypted at rest on the server, never displayed again after saving, and are used
            only for requests made by your account. Saving a new key replaces the stored one.
          </p>
        </CardContent>

        <CardFooter className="flex-col items-start gap-3 border-t border-border/70 bg-muted/30 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex items-center gap-1.5 text-sm font-medium text-success">
            {justSaved && (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Settings saved. You're ready to run research.
              </>
            )}
          </p>
          <Button onClick={handleSave} disabled={saveMutation.isPending || isStatusLoading} size="lg">
            {saveMutation.isPending ? (
              <>
                Saving
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
