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
  created_at: string
  listing_enabled?: boolean
  listing_quota?: number
  permission_requested?: boolean
}

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
  created_at: string
  updated_at: string
  // joined
  seller?: User
  offer?: Offer
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
  purchased_at: string
  updated_at: string
  artwork?: Artwork
  user?: User
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
