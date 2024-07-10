using MC.Core.Models;
using MC.Data.Entities;
using MC.Models.Request;
using MC.Models.Response;
using Microsoft.EntityFrameworkCore;

namespace MC.Core.Services
{
    public interface IStateService
    {
        public Task<ListStatesResponse> List(ListStatesRequest request);
        public Task<AddStateResponse> Add(AddStateRequest request);
        public Task<GetStateResponse> Get(GetStateRequest request);
        public Task<UpdateStateResponse> Update(UpdateStateRequest request);
        public Task<DeleteStateResponse> Delete(DeleteStateRequest request);
        public Task<bool> Verify(Guid stateId);
    }
    public class StateService(CCSQLContext context) : IStateService
    {

        public async Task<bool> Verify(Guid stateId)
        {
            var response = new GetStateResponse();

            var state = await context.State.SingleOrDefaultAsync(entity => entity.ID == stateId);
            return state != null;
        }
        public async Task<ListStatesResponse> List(ListStatesRequest request)
        {
            var states = await context.State.ToListAsync();

            return new ListStatesResponse()
            {
                States =
                [
                    .. states
                        .Select(entity => new MC.Models.Entities.State()
                        {
                            ID = entity.ID,
                            Caption = entity.Caption,
                            Description = entity.Description,
                            CreationDate = entity.CreationDate,
                            Rows = [],
                            Columns = []
                        })
                        .OrderByDescending(entity => entity.CreationDate)
                ],
            };
        }

        public async Task<AddStateResponse> Add(AddStateRequest request)
        {

            var response = new AddStateResponse();


            var stateId = Guid.NewGuid();
            context.State.Add(new State()
            {
                ID = stateId,
                Caption = request.State.Caption,
                Description = request.State.Description,
                CreationDate = DateTime.UtcNow
            });
            await context.SaveChangesAsync();

            foreach (var row in request.State.Rows)
            {
                context.StateRow.Add(new StateRow()
                {
                    ID = Guid.NewGuid(),
                    StateID = stateId,
                    CodeStart = row.CodeStart,
                    CodeEnd = row.CodeEnd,
                });
            }

            foreach (var column in request.State.Columns)
            {
                context.StateColumn.Add(new StateColumn()
                {
                    ID = Guid.NewGuid(),
                    StateID = stateId,
                    Caption = column.Caption,
                    Code = column.Code,
                    Color = column.Color,
                    Position = column.Position,
                });
            }
            await context.SaveChangesAsync();

            return response;

        }

        public async Task<GetStateResponse> Get(GetStateRequest request)
        {
            var response = new GetStateResponse();

            var state = await context.State.SingleOrDefaultAsync(entity => entity.ID == request.ID);
            if (state != null)
            {
                var rows = await context.StateRow.Where(entity => entity.StateID == state.ID).ToListAsync();
                var columns = await context.StateColumn.Where(entity => entity.StateID == state.ID).ToListAsync();

                response.State = new MC.Models.Entities.State()
                {
                    ID = state.ID,
                    Caption = state.Caption,
                    Description = state.Description,
                    CreationDate = state.CreationDate,
                    Rows = [
                        .. rows.Select(entity => new MC.Models.Entities.StateRow()
                        {
                            ID = entity.ID,
                            CodeStart = entity.CodeStart,
                            CodeEnd = entity.CodeEnd,
                        }).OrderBy(entity=> entity.CodeStart)
                    ],
                    Columns =
                    [
                        .. columns.Select(entity => new MC.Models.Entities.StateColumn()
                        {
                            ID = entity.ID,
                            Caption = entity.Caption,
                            Code = entity.Code,
                            Position = entity.Position,
                            Color = entity.Color,
                        }).OrderBy(entity => entity.Position),
                    ],
                };
            }
            else
            {
                response.CreateError(Constants.ErrorCodes.StateDoesNotExist);
            }
            return response;
        }

        public async Task<UpdateStateResponse> Update(UpdateStateRequest request)
        {
            var response = new UpdateStateResponse();

            if (request.ID != request.State.ID)
            {
                response.CreateError(Constants.ErrorCodes.StateIDMismatch);
            }
            else
            {
                var state = await context.State.SingleOrDefaultAsync(entity => entity.ID == request.ID);

                if (state != null)
                {
                    var columns = await context.StateColumn.Where(entity => entity.StateID == state.ID).ToListAsync();

                    if (columns.Count > 0)
                    {
                        context.StateColumn.RemoveRange(columns);
                        await context.SaveChangesAsync();
                    }

                    foreach (var rows in request.State.Rows)
                    {
                        context.StateRow.Add(new StateRow()
                        {
                            ID = Guid.NewGuid(),
                            StateID = state.ID,
                            CodeStart = rows.CodeStart,
                            CodeEnd = rows.CodeEnd,
                        });
                    }

                    foreach (var column in request.State.Columns)
                    {
                        context.StateColumn.Add(new StateColumn()
                        {
                            ID = Guid.NewGuid(),
                            StateID = state.ID,
                            Caption = column.Caption,
                            Code = column.Code,
                            Color = column.Color,
                            Position = column.Position,
                        });
                    }


                    state.Caption = request.State.Caption;
                    state.Description = request.State.Description;
                    state.CreationDate = DateTime.UtcNow;

                    await context.SaveChangesAsync();
                }
            }
            return response;
        }

        public async Task<DeleteStateResponse> Delete(DeleteStateRequest request)
        {
            var response = new DeleteStateResponse();
            var state = await context.State.SingleOrDefaultAsync(entity => entity.ID == request.ID);
            if (state != null)
            {
                var rows = await context.StateRow.Where(entity => entity.StateID == state.ID).ToListAsync();
                var columns = await context.StateColumn.Where(entity => entity.StateID == state.ID).ToListAsync();

                bool hasChange = false;

                if (rows.Count > 0)
                {
                    hasChange = true;
                    context.StateRow.RemoveRange(rows);
                }
                if (columns.Count > 0)
                {
                    hasChange = true;
                    context.StateColumn.RemoveRange(columns);
                }
                if (hasChange)
                {
                    await context.SaveChangesAsync();
                }

                context.State.Remove(state);
                await context.SaveChangesAsync();
            }
            return response;
        }
    }
}
