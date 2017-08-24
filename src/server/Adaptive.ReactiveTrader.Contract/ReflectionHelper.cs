using System;
using System.Reflection;

namespace Adaptive.ReactiveTrader.Contract
{
	public class ReflectionHelper {
		public static Assembly ContractsAssembly = typeof(ReflectionHelper).GetTypeInfo().Assembly; 
	}
}