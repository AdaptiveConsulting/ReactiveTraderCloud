using Adaptive.ReactiveTrader.Client.UI.Shell;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Fragment = Android.Support.V4.App.Fragment;

namespace Adaptive.ReactiveTrader.Client.Android.UI.Blotter
{
    public class BlotterFragment : Fragment
    {
        private readonly IShellViewModel _shellViewModel;

        public BlotterFragment() // Required by Android SDK
        {
        }

        public BlotterFragment(IShellViewModel shellViewModel)
        {
            _shellViewModel = shellViewModel;
        }
        
        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            var view = inflater.Inflate(Resource.Layout.BlotterView, container, false);

            var blotterRowsRecyclerView = view.FindViewById<RecyclerView>(Resource.Id.BlotterRowsRecyclerView);
            blotterRowsRecyclerView.HasFixedSize = true;
            var blotterGridLayoutManager = new LinearLayoutManager(Activity) {StackFromEnd = true};
            blotterRowsRecyclerView.SetLayoutManager(blotterGridLayoutManager);
            var blotterRowsAdapter = new BlotterRowAdapter(blotterRowsRecyclerView, _shellViewModel.Blotter.Trades);
            blotterRowsRecyclerView.SetAdapter(blotterRowsAdapter);
            
            return view;
        }
    }
}