# Security Specification - Zyra Legecy

## 1. Data Invariants
- A product must have a title, category, and price >= 0.
- An order must have items, a valid customer name/email, and a status.
- A user can only access their own profile unless they are an admin.
- Only admins can write to products, categories, coupons, and settings.
- Reviews can be created by users but must be approved by admins to show.

## 2. The "Dirty Dozen" Payloads (Security Test Cases)
1. **Unauthorized Product Write**: Attempt to create a product from a non-admin account. (Expected: DENIED)
2. **Order Tampering**: Attempt to change the status of an order from 'pending' to 'delivered' as a regular user. (Expected: DENIED)
3. **Role Escalation**: Attempt to update own user profile to set `role: 'admin'`. (Expected: DENIED)
4. **ID Poisoning**: Attempt to create a product with a 2KB junk string as the ID. (Expected: DENIED)
5. **PII Leak**: Attempt to read the phone numbers of all customers as a logged-in user. (Expected: DENIED)
6. **Coupon Manipulation**: Attempt to change the `value` of an existing coupon. (Expected: DENIED)
7. **Phantom Orders**: Attempt to create an order for someone else's `userId`. (Expected: DENIED)
8. **Invalid Price**: Attempt to create a product with a negative price. (Expected: DENIED)
9. **Spam Reviews**: Attempt to flood the reviews collection with empty comments. (Expected: DENIED)
10. **System Field Override**: Attempt to update the `createdAt` timestamp of a blog post. (Expected: DENIED)
11. **Shadow Categories**: Attempt to create a category without a name or slug. (Expected: DENIED)
12. **Settings Breach**: Attempt to change the site logo URL as a public user. (Expected: DENIED)

## 3. Implementation Note
The following rules will use a robust helper system to enforce these invariants.
Admin access is strictly verified against a trusted `users/{userId}` document.
