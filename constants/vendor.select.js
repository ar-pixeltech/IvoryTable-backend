export const vendorSafeSelect = {
    id: true,
    name: true,
    phone: true,
    email: true,
    businessType: true,
    isActive: true,
    subscriptionId: true,
    subscriptionEndsAt: true,
    trialEndsAt: true,
    createdAt: true,
};

export const vendorWithSubscriptionSelect = {
    id: true,
    name: true,
    phone: true,
    email: true,
    businessType: true,
    isActive: true,
    subscriptionEndsAt: true,
    trialEndsAt: true,
    createdAt: true,
    subscription: {
        select: {
            id: true,
            name: true,
            price: true,
            durationDays: true,
            isTrial: true,
        },
    },
};