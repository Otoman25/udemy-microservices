import Stripe from "stripe"
import { environment } from "./utils/environment"

export const stripe = new Stripe(environment.stripe.STRIPE_KEY, {
    apiVersion: '2022-11-15'
})