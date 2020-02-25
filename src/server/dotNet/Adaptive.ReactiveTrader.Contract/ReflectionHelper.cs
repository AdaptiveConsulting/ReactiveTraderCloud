using System.Reflection;

namespace Adaptive.ReactiveTrader.Contract
{
	public static class ReflectionHelper {
		public static readonly Assembly ContractsAssembly = typeof(ReflectionHelper).GetTypeInfo().Assembly; 
	}
}
