using System;
using UIKit;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public partial class StartUpView : UIViewController
	{
		private bool _isActive;
		private string _title;
		private string _error;
        private Action _retry;

        public StartUpView (Action retry) : base ("StartUpView", null)
		{
            _retry = retry;
		}

        public StartUpView(IntPtr ptr) : base(ptr)
        {
        }

		public void DisplayMessages(bool isActive, string title, string error = null) {
			_isActive = isActive;
			_title = title;
			_error = error;
			ShowMessages ();
		}

		private void ShowMessages() {
			if (IsViewLoaded) {
				if (_isActive) {
					this.Activity.StartAnimating ();
				} else {
					this.Activity.StopAnimating ();
				}
				this.Connecting.Text = _title;
				ErrorLabel.Text = _error;

                RetryButton.Hidden = string.IsNullOrEmpty(_error);
			}
		}

		public override void ViewDidLoad ()
		{
			base.ViewDidLoad ();
			this.Activity.HidesWhenStopped = true;

			ShowMessages ();
			// Perform any additional setup after loading the view, typically from a nib.
		}

        partial void RetryButton_TouchUpInside(UIButton sender)
        {
            _retry();
        }
	}
}

