export type UserRole = 'admin' | 'customer' | 'seller'
export type ArtworkStatus = 'pending_approval' | 'listed' | 'rejected' | 'sold'
export type TicketStatus = 'open' | 'resolved'
export type PaymentStatus = 'pending' | 'confirmed' | 'declined'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url?: string
  address?: string
  created_at: string
  listing_enabled?: boolean
  listing_quota?: number
  permission_requested?: boolean
}

export type ArtworkType = 'original' | 'repainted'

export interface Artwork {
  id: string
  title: string
  description?: string
  category: string
  image_url: string
  seller_id: string
  seller_requested_price: number
  listing_price?: number
  quantity: number
  status: ArtworkStatus
  artwork_type?: ArtworkType
  artist_name?: string
  created_at: string
  updated_at: string
  // joined
  seller?: User
  offer?: Offer
  reviews?: OrderReview[]
}

export interface Offer {
  id: string
  artwork_id: string
  discount_percentage: number
  valid_until: string
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  artwork_id: string
  added_at: string
  artwork?: Artwork
}

export interface Order {
  id: string
  user_id: string
  artwork_id: string
  amount_paid: number
  payment_method?: string
  transaction_id?: string
  transaction_amount?: number
  payment_status: PaymentStatus
  payment_ref?: string
  shipping_address?: string
  purchased_at: string
  updated_at: string
  artwork?: Artwork
  user?: User
  order_reviews?: OrderReview[]
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  admin_reply?: string
  status: TicketStatus
  created_at: string
  updated_at: string
  user?: User
}

export interface ArtworkChat {
  id: string
  artwork_id: string
  sender_id: string
  message: string
  created_at: string
  sender?: User
}

export interface SellerChat {
  id: string
  seller_id: string
  sender_id: string
  message: string
  created_at: string
  sender?: User
}

export interface OrderReview {
  id: string
  order_id: string
  user_id: string
  artwork_id: string
  website_rating?: number
  website_comment?: string
  artwork_rating?: number
  artwork_comment?: string
  created_at: string
  updated_at: string
  user?: User
  artwork?: Artwork
}

// ────────────────────────────────────────────────────────────────────────────
// Address Types & Utils
// ────────────────────────────────────────────────────────────────────────────
export interface AddressDetails {
  fullName: string
  phone: string
  pincode: string
  houseNo: string
  area: string
  landmark?: string
  city: string
  state: string
}

export function parseAddress(addressStr?: string): AddressDetails | null {
  if (!addressStr) return null
  try {
    const parsed = JSON.parse(addressStr)
    if (parsed && typeof parsed === 'object' && 'fullName' in parsed) {
      return parsed as AddressDetails
    }
    return null
  } catch (e) {
    // If it fails to parse, it's likely a legacy raw text address
    return null
  }
}

export function formatAddress(address: AddressDetails): string {
  const parts = [
    address.fullName,
    address.phone,
    [address.houseNo, address.area].filter(Boolean).join(', '),
    address.landmark ? `Landmark: ${address.landmark}` : null,
    `${address.city}, ${address.state} - ${address.pincode}`
  ]
  return parts.filter(Boolean).join('\n')
}
