import { createClient } from "@supabase/supabase-js"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

console.log("=== SUPABASE CONFIG DEBUG ===")
console.log("Environment:", process.env.NODE_ENV)
console.log("Supabase URL present:", !!supabaseUrl)
console.log("Supabase URL value:", supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "MISSING")
console.log("Anon Key present:", !!supabaseAnonKey)
console.log("Service Key present:", !!supabaseServiceKey)

// Validate required environment variables
if (!supabaseUrl) {
  console.error("❌ Supabase URL is not configured. Please add NEXT_PUBLIC_SUPABASE_URL to your environment variables.")
}

if (!supabaseAnonKey) {
  console.error(
    "❌ Supabase Anon Key is not configured. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
  )
}

if (!supabaseServiceKey) {
  console.error(
    "❌ Supabase Service Key is not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.",
  )
}

// Create a mock client for development when Supabase is not configured
const createMockClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    eq: function () {
      return this
    },
    like: function () {
      return this
    },
    order: function () {
      return this
    },
    limit: function () {
      return this
    },
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      getPublicUrl: () => ({ data: { publicUrl: "/placeholder.svg" } }),
      remove: () => Promise.resolve({ data: null, error: null }),
    }),
  },
})

// Create a single supabase client for server-side usage
export const supabaseServer = (() => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Cannot create Supabase server client - missing configuration")
    return createMockClient() as any
  }

  try {
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("✅ Supabase server client created successfully")
    return client
  } catch (error) {
    console.error("❌ Failed to create Supabase server client:", error)
    return createMockClient() as any
  }
})()

// Create a singleton for the client-side supabase client
let clientSingleton: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowser = () => {
  if (clientSingleton) return clientSingleton

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase not configured for browser client")
    return createMockClient() as any
  }

  clientSingleton = createClient(supabaseUrl, supabaseAnonKey)
  return clientSingleton
}
