//import { useContext } from 'react';
//import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

import useGrimoire from '~/hooks/use-grimoire';
import { getBackgroundColorFromType } from '~/lib/utils';

export default function RecipeBox() {
  //const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);
  const { spellRecipe, generateNewSpell } = useGrimoire();
  // const { logger } = useContext(LoggerContext);
  console.log('spell receipe', spellRecipe);

  // Object.entries(spellRecipe).map(([type, recipe]) => {

  // })
  return (
    <div id='inner_recipe_box' className='max-w-full mt-[150px]'>
      <div id='recipe-bg' className='h-[20vh] w-full max-h-full mx-auto bg-recipe-bg'>
        <div id='recipe-header' className='h-[80p] grid grid-cols-3'>
          <div
            id='title'
            className='mt-3 flex items-center justify-center gap-6 col-start-2 text-xl'
          >
            Suggested Recipe
          </div>
          <div id='new-spell' className='float-right'>
            <button
              id='new-spell-btn'
              style={{ backgroundImage: `url(/images/new-spell.gif)` }}
              className='scale-70 bg-cover h-[70px] w-[70px] text-white py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-opacity-50 float-right mr-8 mt-3'
              onClick={generateNewSpell}
            ></button>
          </div>
        </div>
        <div id='ingredients_contianer' className='grid grid-cols-4 text-center align-top'>
          {Object.entries(spellRecipe).map(([type, recipe]) => {
            return recipe ? (
              <div
                id={`ingredient-${recipe.rfid}-${type}`}
                className='relative -top-[80px] scale-50'
                key={recipe.rfid}
              >
                <div
                  id='color-blur'
                  className={`absolute inset-0 rounded-lg blur-xl z-0 ${getBackgroundColorFromType(
                    type,
                  )}`}
                ></div>
                <img
                  className='relative flex mt-3 scale-75'
                  src={`/ingredients/${recipe?.assetName}`}
                  alt={`ingredient-${recipe.ingredientName}`}
                ></img>
                <div
                  id={`ingredient-${recipe.ingredientName}-label`}
                  className='mt-4 relative mt-3 text-xl'
                >
                  {`${recipe.ingredientName}`}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
