

/**
 * HubSpot interfaces for webhooks
 */

export enum SubscriptionType {
    ContactCreation = 'contact.creation',
    ContactDeletion = 'contact.deletion', 
    ContactPrivacyDelection = 'contact.privacyDeletion', 
    ContactPropertyChange = 'contact.propertyChange', 
    CompanyCreation = 'company.creation',
    CompanyDeletion = 'company.deletion',
    CompanyPropertyChange = 'company.propertyChange',
    DealCreation = 'deal.creation', 
    DealDeletion = 'deal.deletion', 
    DealPropertyChange = 'deal.propertyChange'
 }

export interface HubspotPayload{
    eventId: number;
    subscriptionId: number;
    portalId: number;
    appId: number;
    occurredAt: number;
    subscriptionType: SubscriptionType;
    attemptNumber: number;
    objectId: number;
    propertyName?: string;
    propertyValue?: string;
    changeFlag?: string;
    changeSource: string;
}


/**
 * SaaSquatch interfaces for webhooks
 */

export enum EventType {
  UserCreated = 'user.created',
  UserRewardBalanceChanged = 'user.reward.balance.changed',
  CouponCreated = 'coupon.created', 	
  RewardCreated = 'reward.created', 
  EmailReferredRewardEarned = 'email.referred.reward.earned', 	
  EmailReferralStarted = 'email.referral.started', 
  EmailReferralPaid = 'email.referral.paid',
  EmailReferralRewardLimitReached = 'email.referral.rewardLimitReached',
  ReferralAutomoderationComplete = 'referral.automoderation.complete',
  ReferralStarted = 'referral.started',
  ReferralConverted = 'referral.converted',
  ReferralEnded = 'referral.ended',
  ThemePublishFinished = 'theme.publish.finished',
  ExportCreated = 'export.created',
  ExportCompleted = 'export.completed',
  Test = 'test'
}

export interface SaasquatchPayload{
    id: string,
    type: EventType,
    tenantAlias: string,
    live: boolean,
    created: number,
    data: object
}

/**
 * Configuration interface
 */

export interface Configuration {
    PushPartixipantsAsContacts: boolean, 
    PullParticipantsIntoContacts: boolean,
    DeleteContactwhenParticipantDeleted: boolean,
    PushContactsAsParticipants: boolean,
    PullContactsIntoParticipants: boolean, 
    DeleteParticipantWhenContactDeleted: boolean,
    accessToken: string, 
    refreshToken: string
}
