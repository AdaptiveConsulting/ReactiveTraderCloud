using System;
using System.IO;
using EventStore.ClientAPI.Common.Utils;

namespace EventStore.ClientAPI.Transport.Http
{
    internal class AsyncStreamCopier<T>
    {
        public event EventHandler Completed;

        public T AsyncState { get; private set; }
        public Exception Error { get; private set; }

        private readonly byte[] _buffer = new byte[4096];
        private readonly Stream _input;
        private readonly Stream _output;

        public AsyncStreamCopier(Stream input, Stream output, T state)
        {
            Ensure.NotNull(input, "input");
            Ensure.NotNull(output, "output");

            _input = input;
            _output = output;

            AsyncState = state;
            Error = null;
        }

        public void Start()
        {
            GetNextChunk();
        }

        private async void GetNextChunk()
        {
            try
            {
                var bytesRead = await _input.ReadAsync(_buffer, 0, _buffer.Length);
                InputReadCompleted(bytesRead);
            }
            catch (Exception e)
            {
                Error = e;
                OnCompleted();
            }
        }

        private async void InputReadCompleted(int bytesRead)
        {
            try
            {
                if (bytesRead <= 0) //mono can return -1
                {
                    OnCompleted();
                    return;
                }

                await _output.WriteAsync(_buffer, 0, bytesRead);
                OutputWriteCompleted();
            }
            catch (Exception e)
            {
                Error = e;
                OnCompleted();
            }
        }

        private void OutputWriteCompleted()
        {
            try
            {
                GetNextChunk();
            }
            catch (Exception e)
            {
                Error = e;
                OnCompleted();
            }
        }

        private void OnCompleted()
        {
            Completed?.Invoke(this, EventArgs.Empty);
        }
    }
}