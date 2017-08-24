using System.Diagnostics;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public class BoolUserDefault : ObservableUserDefault<bool>
    {
        public BoolUserDefault(string defaultName) : base(defaultName)
        {            
        }
        
        protected override bool GetValue()
        {
            var result = Defaults.BoolForKey(DefaultName);
            Debug.WriteLine($"From UserDefaults: {DefaultName} is {result}");
            return result;
        }

        protected override void SetValue(bool value)
        {
            Debug.WriteLine($"Setting UserDefaults: {DefaultName} to {value}");
            Defaults.SetBool(value, DefaultName);
        }
    }    
}