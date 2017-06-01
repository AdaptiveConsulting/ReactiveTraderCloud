namespace Adaptive.ReactiveTrader.Contract.Events.CreditAccount
{
    public class CreditAccountCreatedEvent
    {
        public CreditAccountCreatedEvent(string accountName)
        {
            AccountName = accountName;
        }

        public string AccountName { get; }
    }
}