using System;
using System.Globalization;

using UIKit;
using Foundation;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public class NotionalTextFieldDelegate : UITextFieldDelegate
	{
		private INotionalDelegateRecipient _outcomeRecipient;

		public NotionalTextFieldDelegate (INotionalDelegateRecipient outcomeRecipient)
		{
			_outcomeRecipient = outcomeRecipient;
		}

		public override void EditingStarted(UITextField textField)
		{
			System.Console.WriteLine ("EditingStarted '{0}' ?", textField.Text);

			_outcomeRecipient.NotionalValueEditStarted ();
		}

		public override void EditingEnded(UITextField textField)
		{
			System.Console.WriteLine ("EditingEnded '{0}' ?", textField.Text);

			_outcomeRecipient.NotionalValueEditComplete ();
		}

		public override bool ShouldChangeCharacters(UITextField textField, NSRange theRange, String replacementString)
		{
			System.Console.WriteLine ("ShouldChangeCharacters '{0}' -> {1}, {2}, '{3}' ?", textField.Text, theRange.Location, theRange.Length, replacementString);

			// We could prevent (or warn of) nonsensical or out-of-bounds values?

			return true;
		}

		public override bool ShouldEndEditing(UITextField textField)
		{
			System.Console.WriteLine ("ShouldEndEditing '{0}' ?", textField.Text);

			return true;
		}

		public override bool ShouldBeginEditing(UITextField textField)
		{
			//
			// TODO: Consider tidying here.
			// Is the 'live' value the one on screen, or the one in the model?
			// Or are they always guaranted to be in sync except mid edit?
			//
			System.Console.WriteLine ("ShouldBeginEditing '{0}' ?", textField.Text);

			long parsedNotional;
			if (long.TryParse (textField.Text, NumberStyles.AllowThousands, CultureInfo.InvariantCulture, out parsedNotional)) {
				textField.Text = Styles.FormatNotional (parsedNotional, false);
				return true;
			} else {
				System.Console.WriteLine ("Apparently not! The value already in there is unparsable!");
				return false;
			}

		}
	}
}

